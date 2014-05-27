({
    baseUrl: 'src/',
    paths: {
        requireLib: 'lib/requirejs/require'
    },
    name: "Zeldus",
    include: "requireLib",
    out:"zeldus.js",
    optimize: "none",
    preserveLicenseComments: true,
    generateSourceMaps: false
})