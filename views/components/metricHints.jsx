const METRIC_HINTS = [
    // Node metrics
    {value: "APP Node alive {0,1}", data: "isNonNull($node.ping.ping.10.130.64.1)"},
    {value: "DMZ Node alive {0,1}", data: "isNonNull($node.ping.ping.10.131.0.1)"},
    {value: "Hadoop/DB Node alive {0,1}", data: "isNonNull($node.ping.ping.10.130.0.1)"},
    // CPU
    {value: "User CPU usage(%) [0-100]", data: "averageSeriesWithWildcards($node.cpu.*.percent.user, 2)"},
    {value: "System CPU usage(%) [0-100]", data: "averageSeriesWithWildcards($node.cpu.*.percent.system, 2)"},
    {value: "Load longterm [0+]", data: "$node.load.load.relative.longterm"},
    {value: "Load shortterm [0+]", data: "$node.load.load.relative.shortterm"},
    {value: "Contexts' switching(times/min) [0+]", data: "$node.contextswitch.contextswitch"},
    // Memory
    {value: "Memory usage(%) [0-100]", data: "$node.memory.percent.used"},
    {value: "Swap usage(%) [0-100]", data: "$node.swap.percent.used"},
    // Network
    {value: "Network rx(bytes/min) [0+]", data: "$node.interface.<interface_name>.if_octets.rx"},
    {value: "Network tx(bytes/min) [0+]", data: "$node.interface.<interface_name>.if_octets.tx"},
    {value: "TCP :80 listening {0,1}", data: "$node.tcpconns.80-local.tcp_connections.LISTEN"},
    // Disk and file system
    {value: "File descriptors used [0+]", data: "$node.fhcount.file_handles.used"},
    {value: "/dev/xvda1 I/O utils(%) [0-100]", data: "asPercent($node.disk.dev_xvda1.disk_io_time.io_time, 1000)"},
    {value: "/dev/xvda2 I/O utils(%) [0-100]", data: "asPercent($node.disk.dev_xvda2.disk_io_time.io_time, 1000)"},
    {value: "/dev/xvdb1 I/O utils(%) [0-100]", data: "asPercent($node.disk.dev_xvdb1.disk_io_time.io_time, 1000)"},
    {value: "/ used(%) [0-100]", data: "$node.df.root.percent_bytes.used"},
    {value: "/data used(%) [0-100]", data: "$node.df.data.percent_bytes.used"}
]

export default METRIC_HINTS
