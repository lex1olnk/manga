module.exports = {
    apps: [
        {
            name: "Backend",
            exec_mode: "cluster",
            script: "npm run dev",
            watch: true,
            ignore_watch: [
                './node_modules',
            ]
        }
    ]
}
