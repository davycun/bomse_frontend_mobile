module.exports = {
    devServer: {
        port:4000,
        proxy: "http://localhost:8081"
    },
    publicPath:"/static/bomse_mobile"
}