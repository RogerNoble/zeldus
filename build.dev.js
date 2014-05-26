({
    baseUrl: 'src/',
    paths: {
        requireLib: 'lib/requirejs/require'
    },
    name: "zeldus",
    include: "requireLib",
    out:"zeldus.js",
    optimize: "none",
    preserveLicenseComments: true,
    generateSourceMaps: false
})