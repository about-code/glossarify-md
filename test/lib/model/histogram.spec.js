import { strictEqual, fail } from "node:assert";
import { Histogram } from "../../../lib/model/histogram.js";

// === / Helpers \ ===
const keyFunction = (sample) => sample.key;
const doSampling = (histogram, distribution) => {
    return Object
        .keys(distribution)
        .forEach(key => {
            const count = distribution[key];
            for (let j = 0; j < count; j++) {
                histogram.nextSample({ key, index: j });
            }
        });
};
const assertDistribution = (actual, expected) => {
    strictEqual(Object.keys(actual).length, Object.keys(expected).length, "Not the same number of keys.");
    const keyExpected = Object.keys(expected).sort();
    const keyActual = Object.keys(actual).sort();
    for (let i = 0; i < keyExpected.length; i++) {
        strictEqual(keyActual[i], keyExpected[i], "Different key set.");
        strictEqual(actual[keyActual[i]], expected[keyExpected[i]], `Different value for key ${keyExpected[i]}`);
    }
};
// === \ Helpers / ===

(function it_must_be_correct_for_less_samples_than_window_size() {

    // prepare
    const histogram = new Histogram( { keyFn: keyFunction, windowSize: 10 });
    const expectDistribution = {
        "a": 1
        ,"b": 4
        ,"c": 2
    };

    // act
    doSampling(histogram, expectDistribution);
    const actualDistribution = histogram.getHistogramState().buckets;
    console.log(histogram.toString());

    // assert
    assertDistribution(actualDistribution, expectDistribution);
})();


(function it_must_be_correct_for_more_samples_than_window_size() {

    // prepare
    const histogram = new Histogram( { keyFn: keyFunction, windowSize: 10 });
    const sampleDistribution = {
        "a": 5
        ,"b": 6
        ,"c": 7
    };

    // Expect a distribution over ten samples, only.
    const expectDistribution = {
        "b": 3
        ,"c": 7
    };

    // act
    doSampling(histogram, sampleDistribution);
    const actualDistribution = histogram.getHistogramState().buckets;
    console.log(histogram.toString());

    // assert
    assertDistribution(actualDistribution, expectDistribution);
})();

(function it_must_be_correct_for_hierarchical_histograms() {

    // prepare
    const parentHGram = new Histogram( { keyFn: keyFunction });
    const child1HGram = new Histogram( { keyFn: keyFunction, parent: parentHGram });
    const child2HGram = new Histogram( { keyFn: keyFunction, parent: parentHGram });
    const sampleDistribution = {
        "a": 5
        ,"b": 6
        ,"c": 7
    };
    const expectParentDistribution = {
        "a": 10
        ,"b": 12
        ,"c": 14
    };

    // act
    doSampling(child1HGram, sampleDistribution);
    doSampling(child2HGram, sampleDistribution);
    const actualDistribution = parentHGram.getHistogramState().buckets;
    console.log(parentHGram.toString());

    // assert
    assertDistribution(actualDistribution, expectParentDistribution);
})();

(function it_should_invoke_onWindowSetup_for_less_samples_than_window_size() {

    // prepare
    const windowSize = 10;
    const countWindowSetupsExpected = windowSize - 1;
    let countWindowSetupsActual = 0;
    const histogram = new Histogram({
        keyFn: keyFunction
        ,windowSize: windowSize
        ,onWindowSetup: (state, sample) => {
            countWindowSetupsActual++;
            // Note: encodes exact knowledge about how sampling is implemented.
            // That's why this test doesn't use the global doSampling helper.
            if (countWindowSetupsActual === 1) {
                strictEqual(sample.key, "a");
                strictEqual(state.buckets.a, 1);
                strictEqual(state.buckets.b, undefined);
                strictEqual(state.buckets.c, undefined);
            } else if (countWindowSetupsActual === 6 ) {
                strictEqual(sample.key, "b");
                strictEqual(state.buckets.a, 5);
                strictEqual(state.buckets.b, 1);
                strictEqual(state.buckets.c, undefined);
            } else if (countWindowSetupsActual > windowSize) {
                fail("Should not have invoked onWindowSetup more than `windowSize` times.");
            }
        }
    });
    const sampleDistribution = {
        "a": 5
        ,"b": 6
        ,"c": 7
    };

    // act: doSampling
    Object.keys(sampleDistribution).forEach(key => {
        const count = sampleDistribution[key];
        for (let j = 0; j < count; j++) {
            histogram.nextSample({ key, index: j });
        }
    });
    console.log(histogram.toString());

    // assert
    strictEqual(countWindowSetupsActual, countWindowSetupsExpected);
})();


(function it_should_invoke_onWindowComplete_and_onWindowObserve_for_samples_equal_to_window_size() {

    // prepare
    let onWindowObserveCountActual = 0;
    let onWindowCompleteCountActual = 0;
    const onWindowCompleteCountExpected = 1;
    const onWindowObserveCountExpected = 3;
    const firstCallDistributionExpected = {
        "a": 9
        ,"b": 1
    };

    const histogram = new Histogram( {
        keyFn: keyFunction
        ,windowSize: 10
        ,onWindowComplete: (state, sample) => {
            if (onWindowObserveCountActual === 0) {
                assertDistribution(state.buckets, firstCallDistributionExpected);
                strictEqual(sample.key, "b");
            }
            onWindowCompleteCountActual++;
        }
        ,onWindowObserve: (state, sample, observeAt) => {
            if (onWindowObserveCountActual === 0) {
                assertDistribution(state.buckets, firstCallDistributionExpected);
                strictEqual(sample.key, "b");
                strictEqual(observeAt, 0);
            }
            onWindowObserveCountActual++;
        }
    });
    const sampleDistribution = {
        "a": 9
        ,"b": 2
        ,"c": 1
    };

    // act
    doSampling(histogram, sampleDistribution);
    console.log(histogram.toString());

    // assert
    strictEqual(onWindowCompleteCountActual, onWindowCompleteCountExpected, "Unexpected number of onWindowComplete calls.");
    strictEqual(onWindowObserveCountActual, onWindowObserveCountExpected, "Unexpected number of onWindowObserve calls.");
})();

(function it_should_not_memorize_samples_for_window_size_0() {

    const histogram = new Histogram( { keyFn: keyFunction });
    const expectDistribution = {
        "a": 1
        ,"b": 4
        ,"c": 2
    };

    // act
    doSampling(histogram, expectDistribution);
    const samples = histogram.getHistogramState().samples;

    // assert
    strictEqual(samples.length, 0);
})();


(function it_should_apply_window_size_0_for_window_size_param_greater_MAX_WINDOW_SIZE() {

    const histogram = new Histogram( { keyFn: keyFunction, windowSize: 10000 });
    const expectDistribution = {
        "a": 1
        ,"b": 4
        ,"c": 2
    };

    // act
    doSampling(histogram, expectDistribution);
    const samples = histogram.getHistogramState().samples;
    console.log(histogram.toString());

    // assert
    strictEqual(samples.length, 0);
})();


(function it_should_apply_window_size_for_window_size_param_is_MAX_WINDOW_SIZE() {

    const histogram = new Histogram( { keyFn: keyFunction, windowSize: 9999 });
    const sampleDistribution = {
        "a": 9999
        ,"b": 1
        ,"c": 1
    };
    const expectDistribution = {
        "a": 9997
        ,"b": 1
        ,"c": 1
    };

    // act
    doSampling(histogram, sampleDistribution);
    const state = histogram.getHistogramState();
    const samples = state.samples;
    const data = state.buckets;
    console.log(histogram.toString());

    // assert
    strictEqual(samples.length, 9999);
    assertDistribution(data, expectDistribution);
})();


(function it_should_apply_window_size_for_window_size_param_less_MAX_WINDOW_SIZE() {

    const histogram = new Histogram( { keyFn: keyFunction, windowSize: 9998 });
    const sampleDistribution = {
        "a": 9998
        ,"b": 1
        ,"c": 1
    };
    const expectDistribution = {
        "a": 9996
        ,"b": 1
        ,"c": 1
    };

    // act
    doSampling(histogram, sampleDistribution);
    const state = histogram.getHistogramState();
    const samples = state.samples;
    const data = state.buckets;
    console.log(histogram.toString());

    // assert
    strictEqual(samples.length, 9998);
    assertDistribution(data, expectDistribution);
})();
/*
(function it_should_print_to_console() {
    const histogram = new Histogram({
        windowSize: 20
        ,keyFn: (sample) => sample.key
        // ,onWindowSetup: (histogram) => console.log(`Setting up... (Sample count: ${histogram.sampleCount})`)
        // ,onWindowComplete: (histogram) => console.log(`Ready (Sample count total: ${histogram.sampleCountTotal})`)
        // ,onWindowObserve: (histogram) => console.log(`Observing at key: ${JSON.stringify(histogram.samples[5])})`)
        // ,windowObserveAt: 5
    });
    let i = 0;
    while (i < 100) {
        i++;
        histogram.nextSample({ key: i % (i % 3 + 1) });
    }
    strictEqual(histogram.toString(), `0: ========== (10)
1: === (3)
2: ======= (7)
`   );
})();
*/
