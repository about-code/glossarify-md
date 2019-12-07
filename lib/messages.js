const NO_BASEDIR =
`✗ Missing argument --baseDir.
Please provide via command line or config file.
See --help for details.
`;

const NO_OUTDIR =
`✗ Missing argument --outDir.
Please provide via command line or config file.
See --help for details.
`;

const OUTDIR_IS_BASEDIR =
`⚠ Warning: --baseDir and --outDir resolve to the same directory.
Such a config is going to overwrite input files in --baseDir.
Choose a different --outDir or change config provided via --config.
Use --force if you want to proceed with current settings.
See --help for details.
`

module.exports = {
    NO_BASEDIR,
    NO_OUTDIR,
    OUTDIR_IS_BASEDIR
}
