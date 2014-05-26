({
    baseUrl: 'src/',
    paths: {
        requireLib: 'lib/requirejs/require'
    },
    name: "zeldus",
    include: "requireLib",
    out:"zeldus.min.js",
    optimize: "uglify2",
    preserveLicenseComments: true,
    generateSourceMaps: false
})