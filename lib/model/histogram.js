/**
 * @typedef {import('unist').Parent} Node
 * @typedef {{[key: string]: number}} HistogramValue
 * @typedef {(sample: object) => string} KeyFn
 *
 *
 * @typedef {object} HistogramState
 * @property {HistogramValue} buckets
 * @property {KeyFn} keyFn
 * @property {object[]} samples - Samples with the most current sample at index 0 and the oldest sample at samples[windowSize-1]. Samples will only be kept when there's a windowSize x with 1 <= x <= 9999. Larger or negative windows sizes will disable sample memory.
 * @property {number} sampleCount - Number of samples within the sliding window. Max value will be the sliding window size.
 * @property {number} sampleCountTotal - Total number of samples processed.
 * @property {number} otherCount - A single arbitrary "catch-all" key which anonymously groups and counts any samples and keys which fell outside the sliding window. It could be considered an artifical entry on a
 * histogram x-axis representing any other samples no longer explicitely visible in the histogram.
 *
 *
 * @typedef {object} HistogramOpts
 * @property {KeyFn} keyFn - Function returning the values on the x-axis of a histogram by which to distinguish and count individual samples.
 * @property {Histogram} parent - Parent histogram. This histogram contributes to a parent histogram which aggregates values from child histograms.
 * @property {number} depth - Numeric indicator of the depth of this histogram in the tree
 * @property {number} windowSize - Constant size of a sliding sampling window between 0 and 9999. Default: 0. For windowSize 1 <= x <= 9999 a sample memory is kept and can be observed. Larger, zero or negative window sizes will disable sample memory.
 * @property {(HistogramState, sample: object) => void} onWindowSetup - Function being invoked for every sample as long as less than `windowSize` samples have been evaluated.
 * @property {(HistogramState, sample: object) => void} onWindowComplete - Function being invoked only once when `windowSize` samples have been evaluated.
 * @property {(HistogramState, sample: object, windowObserveAt: number) => void} onWindowObserve - Function being invoked with a histogram once `windowSize` samples are available. Given the histogram has a sample memory an optional third parameter can be used to get the value at the observed sliding window index.
 * @property {number} windowObserveAt - Index in the histogram sliding window at which to observe values.
 * @property {any} data - Arbitrary data to associate with a histogram distribution
 */

/**
 * A histogram which aggregates a count for samples sharing the same key as
 * returned by a key function.
 *
 * Can be used as a histogram over a limited or unlimited set of input samples,
 * depending on the value of the 'windowSize' parameter. With a fixed window size
 * larger than 0 the histogram will represent a distribution over a fixed set of
 * 'windowSize' samples. It can be used as a sliding window histogram which
 * decrements counters on samples leaving the sliding window range. Once there
 * are no samples for a bucket in the window anymore it will also remove buckets.
 *
 * The histogram supports a tree of histograms where the parent histogram node
 * is an aggregation of the samples of its child nodes. Hierarchical histograms
 * are usually visualized as stacked bar charts where each bar reveals details
 * about how much a particular child distribution contributes to the bars of the
 * parent bar chart.
 *
 * @implements {Node}
 */
export class Histogram {

    /**
     * @param {Partial<HistogramOpts>} opts
     */
    constructor(opts) {

        const SLIDING_WINDOW_MAX_SIZE = 9999;
        const {
            keyFn = () => "0"
            ,parent = null
            ,depth = 0
            ,onWindowSetup = () => undefined
            ,onWindowComplete = () => undefined
            ,onWindowObserve = () => undefined
            ,windowObserveAt = 0
            ,data = undefined
        } = opts;

        const windowSize = parseInt(Math.abs(opts.windowSize));

        this.type = Histogram.type;
        this.keyFn = keyFn;

        /** @type {Histogram[]} */
        this.children = [];
        if (parent instanceof Histogram) {
            this.parent = parent;
            parent.children.push(this);
        }
        this.depth = depth;
        this.windowSize = (windowSize > 0 && windowSize <= SLIDING_WINDOW_MAX_SIZE) ? windowSize : 0;
        this.onWindowObserve = onWindowObserve;
        this.onWindowComplete = onWindowComplete;
        this.onWindowSetup = onWindowSetup;

        /** @type {boolean} */
        this.hasSlidingWindow = !!(this.windowSize > 0);
        /** @type {number} */
        this.windowObserveAt = windowObserveAt > 0 && windowObserveAt < windowSize ? windowObserveAt : 0;
        /** @type {HistogramState} */
        this.histogramState = {};
        this.data = data;

        this.reset();
    }

    isRoot() {
        return !this.parent;
    }

    reset() {
        this.histogramState = {
            buckets: {}
            ,samples: []
            ,sampleCount: 0
            ,sampleCountTotal: 0
            ,otherCount: 0
        };
    }

    hasSampleMemory() {
        return this.hasSampleMemory;
    }

    /**
     * @param {object} sample Sample object. The object will be forwarded to `keyFn` to get the key by which to identify and count samples of the same kind.
     * @returns {HistogramState} Histogram state derived from the current sample.
     */
    nextSample(sample) {

        const {
            histogramState, keyFn, windowSize, hasSlidingWindow,
            onWindowSetup, onWindowComplete, onWindowObserve, windowObserveAt
        } = this;
        let { samples, buckets } = histogramState;

        // Update histogram (x-Axis)
        const sampleKey = `${keyFn.call(null, sample)}`;
        if (! buckets[sampleKey] ) {
            buckets[sampleKey] = 0;
        }

        // Update histogram
        if (hasSlidingWindow && samples.length >= windowSize) {
            // Pop sample which leaves sliding window.
            const dropSample = samples.pop();
            const dropSampleKey = `${keyFn.call(null, dropSample)}`;
            const dropSampleCount = --buckets[dropSampleKey];
            if (dropSampleCount <= 0) {
                buckets = Object
                    .keys(buckets)
                    .filter(key => key !== dropSampleKey)
                    .reduce((newH, key) => {
                        newH[key] = buckets[key];
                        return newH;
                    }, {});
            }
            // We could group any samples which fell "outside the window" under some
            // artificial "other" histogram x-axis key. Though, to prevent potential
            // key collions we use a dedicated histogramState property.
            histogramState.otherCount++;
            histogramState.sampleCountTotal++;

            // Add current sample to sliding window.
            // No need to further increment on `sampleCount` as this is
            // the number of samples within the sliding window ("fill state")
            samples.unshift(sample);
            buckets[sampleKey]++;
        } else if (hasSlidingWindow && samples.length < windowSize) {
            histogramState.samples.unshift(sample);
            buckets[sampleKey]++;
            histogramState.sampleCount++;
            histogramState.sampleCountTotal++;
        } else {
            // Histogram without sliding window and sample memory
            buckets[sampleKey]++;
            histogramState.sampleCount++;
            histogramState.sampleCountTotal++;
        }
        histogramState.buckets = buckets;

        // Prepare passing histogram state as copy only,....
        const histogramStateCopy = this.getHistogramState();
        if (histogramState.sampleCountTotal < windowSize) {
            onWindowSetup.apply(null, [histogramStateCopy, sample]);
        } else if (histogramState.sampleCountTotal === windowSize) {
            onWindowComplete.apply(null, [histogramStateCopy, sample]);
        }
        if (histogramState.sampleCountTotal >= windowSize) {
            onWindowObserve.apply(null, [histogramStateCopy, sample, windowObserveAt]);
        }
        if (this.parent) {
            this.parent.nextSample(sample);
        }
        return histogramStateCopy;
    }

    /**
     * @returns {HistogramState} Copy of the current histogram state
     */
    getHistogramState() {
        const { buckets, samples, sampleCount, sampleCountTotal, otherCount } = this.histogramState;

        /** @type {HistogramState} */
        const histogramStateCopy = {
            buckets: { ...buckets }
            ,samples: [...samples ]
            ,sampleCount
            ,sampleCountTotal
            ,otherCount
        };
        return histogramStateCopy;
    }

    toString() {
        const buckets = this.histogramState.buckets;
        const maxValue = Math.max(...Object.values(buckets));
        const maxBarLength = 100;
        let scale = maxBarLength / maxValue;
        if (scale > 1) {
            scale = 1;
        }
        const output = Object.keys(buckets)
            .map(key => {
                let bar = "";
                let count = buckets[key];
                let size = Math.ceil(count * scale);
                for (let i = 0; i < size; i++) {
                    bar+= "=";
                }
                return `${key}: ${bar} (${count})\n`;
            })
            .reduce((prev, curr) => prev += curr, "");
        return output;
    }
}
Histogram.type = "histogram";
