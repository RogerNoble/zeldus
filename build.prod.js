({
    baseUrl: 'src/',
    name: "lib/almond/almond",
    include: ['Zeldus'],
    optimize: "uglify2",
    preserveLicenseComments: true,
    generateSourceMaps: false,
    wrap: {
        startFile: './build/build-wrap-start.js',
        endFile: './build/build-wrap-end.js'
    }
})