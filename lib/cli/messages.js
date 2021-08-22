export const NO_BASEDIR =
`✗ Missing "baseDir".
Please provide via command line or config file.
See --help for details.
`;

export const NO_OUTDIR =
`✗ Missing argument "outDir".
Please provide via command line or config file.
See --help for details.
`;

export const OUTDIR_IS_BASEDIR =
`⚠ Warning: "baseDir" and "outDir" resolve to the same directory.
This is going to overwrite input files in "baseDir". Choose a different
"outDir" or change config provided via --config.

Use --force if you want to proceed with current settings.
See --help for details.
`;

export const OUTDIR_IS_BASEDIR_WITH_DROP =
`⚠ Error: "baseDir" and "outDir" resolve to the same directory. Cannot apply
"outDirDropOld: true". It would delete the input files in "baseDir". Choose
a different "outDir" or configure "outDirDropOld: false".
`;

export const OUTDIR_NOT_DELETED =
`⚠ Could not delete "outDir". Will proceed by copying files...
`;
