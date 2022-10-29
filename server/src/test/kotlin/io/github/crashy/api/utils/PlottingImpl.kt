//import jetbrains.datalore.base.registration.Disposable
//import jetbrains.datalore.plot.MonolithicCommon
//import jetbrains.datalore.vis.swing.batik.DefaultPlotPanelBatik
//import jetbrains.letsPlot.geom.geomArea
//import jetbrains.letsPlot.geom.geomDensity
//import jetbrains.letsPlot.geom.geomPoint
//import jetbrains.letsPlot.intern.GeomKind
//import jetbrains.letsPlot.intern.GeomKind.*
//import jetbrains.letsPlot.intern.Plot
//import jetbrains.letsPlot.intern.layer.geom.AreaMapping
//import jetbrains.letsPlot.intern.toSpec
//import jetbrains.letsPlot.letsPlot
//import java.awt.Dimension
//import java.awt.GridLayout
//import javax.swing.*
//import javax.swing.WindowConstants.EXIT_ON_CLOSE
//
//data class Layer(val geomKind: GeomKind, val dataSet: DataSet, val name: String)
//
//sealed interface DataSet {
//    data class OneDim(val values: List<Int>) : DataSet
//    data class TwoDim(val values: List<Pair<Int, Int>>) : DataSet
//}
//
//data class PlotDefinition(val xName: String, val yName: String?, val layerTypeName: String?, val layers: List<Layer>)
//
//fun buildPlot(xName: String, yName: String, layerTypeName: String, builder: PlotBuilder.() -> Unit) =
//    PlotBuilder().apply(builder).build(xName, yName, layerTypeName)
//
//fun buildPlot(xName: String, yName: String, values: List<Pair<Int, Int>>, vararg geoms: GeomKind) =
//    PlotBuilder().apply {
//        for (geom in geoms) {
//            layer(geom, "<no-name>", values)
//        }
//    }.build(xName, yName, null)
//fun buildOneDimPlot(xName: String, values: List<Int>, vararg geoms: GeomKind) =
//    PlotBuilder().apply {
//        for (geom in geoms) {
//            oneDimLayer(geom, "<no-name>", values)
//        }
//    }.build(xName, null, null)
//
//class PlotBuilder {
//    private val layers = mutableListOf<Layer>()
//    fun build(xName: String, yName: String?, layerTypeName: String?) =
//        PlotDefinition(xName, yName, layerTypeName, layers)
//
//    fun oneDimLayer(geomKind: GeomKind, name: String, values: List<Int>) {
//        layers.add(Layer(geomKind, DataSet.OneDim(values), name))
//    }
//
//    fun layer(geomKind: GeomKind, name: String, values: List<Pair<Int, Int>>) {
//        layers.add(Layer(geomKind, DataSet.TwoDim(values), name))
//    }
//}
//
////class DatasetBuilder {
////    fun build()
////}
//
////class LayerBuilder {
////    fun build(geomKind: GeomKind, name: String) = Layer(geomKind, dataSet, name)
////}
//
////class PlotBuilder(private var letsPlot: Plot) {
////    fun feature(feature: Feature) {
////        letsPlot += feature
////    }
////
////    fun build() = letsPlot
////}
////
//////fun plotDates(xName: String, yName: String, data: Map<Int, ZonedDateTime>, builder: PlotBuilder.() -> Unit): Plot  =
//////    plotImpl(xName, yName, data as Map<Any, Any>, builder)
//////fun plotNumbers(xName: String, yName: String?, data: Map<Int, Int>, builder: PlotBuilder.() -> Unit): Plot  =
//////    plotImpl(xName, yName, data as Map<Any, Any>, builder)
////
////fun plot(xName: String, data: List<Int>, builder: PlotBuilder.() -> Unit): Plot =
////    plot(xName, null, data.map { it to it }, builder)
////
////fun buildData(xName: String, yName: String?, data: List<Pair<Int, Int>>) = mapOf(
////    xName to data.map { it.first }
////).letIf(yName != null) { map -> map + (yName!! to data.map { it.second }) }
////
////
////fun plot(xName: String, yName: String?, data: List<Pair<Int, Int>>, builder: PlotBuilder.() -> Unit): Plot {
////    val letsPlotData = buildData(xName, yName, data)
////
////    return PlotBuilder(letsPlot(/*letsPlotData*/) {
////        x = xName
////        if (yName != null) y = yName
////    }).apply(builder).build()
////}
//
////private fun plotImpl()
//
//private fun PlotDefinition.toPlot(): Plot {
//    var plot = letsPlot {
//        x = xName
//        y = yName
//    }
//    for (layer in layers) {
//        plot += GeomData(layer, xName, yName, layerTypeName).toLetsPlotGeom()
//    }
//    return plot
////    val data = mapOf(xName  to layers.map { it. })
//}
//
//private fun GeomData.lpSet(): Map<*, *> {
//    val xValues = layer.dataSet.xValues()
//    val oneDimData = mapOf(
//        xName to xValues,
//        layerTypeName to List(xValues.size) { layer.name }
//    )
//    return when (layer.dataSet) {
//        is DataSet.OneDim -> oneDimData
//        is DataSet.TwoDim -> oneDimData + (yName to layer.dataSet.values.map { it.second })
//    }
//}
//
//private fun DataSet.xValues() = when (this) {
//    is DataSet.OneDim -> values
//    is DataSet.TwoDim -> values.map { it.first }
//}
//
//fun usePlots(plots: Map<String, PlotDefinition>) {
////    val rand = java.util.Random()
//
////    val overview = readDatabaseOverview()
////
////    val testPlotDefinition = buildPlot("X", "Y", "Manufacturer") {
////        layer(AREA, "Apple", overview.mapIndexed { index, crashEntry -> index to crashEntry.size })
////        layer(AREA, "Microsoft", overview.mapIndexed { index, crashEntry -> index to crashEntry.size * 2 })
////    }
////
////
////    val data = mapOf<String, Any>(
////        "x" to List(overview.size) { it },
////        "y" to overview.map { it.size },
////        "amar1" to List(overview.size) { "A" }
////    )
////    val data2 = mapOf<String, Any>(
////        "x" to List(overview.size) { it },
////        "y" to overview.map { it.size * 2 },
////        "amar1" to List(overview.size) { "B" }
////    )
////
////
////    var plots = mapOf("Test" to testPlotDefinition.toPlot())
//
//    val convertedPlots = plots.mapValues { it.value.toPlot() }
//
////    plots = mapOf("Test" to letsPlot() +
////            geomArea(data, color = "dark_green", alpha = .8) { x = "x";y = "y"; fill = "amar1" } +
////            geomArea(data2, color = "blue", alpha = .5) { x = "x";y = "y"; fill = "amar1" }
////    )
//
//    val selectedPlotKey = plots.keys.first()
//    val controller = Controller(
//        convertedPlots,
//        selectedPlotKey,
//        false
//    )
//
//    val window = JFrame("Example App")
//    window.defaultCloseOperation = EXIT_ON_CLOSE
//    window.contentPane.layout = BoxLayout(window.contentPane, BoxLayout.Y_AXIS)
//
//    // Add controls
//    val controlsPanel = Box.createHorizontalBox().apply {
//        // Plot selector
//        val plotButtonGroup = ButtonGroup()
//        for (key in plots.keys) {
//            plotButtonGroup.add(
//                JRadioButton(key, key == selectedPlotKey).apply {
//                    addActionListener {
//                        controller.plotKey = this.text
//                    }
//                }
//            )
//        }
//
//        this.add(Box.createHorizontalBox().apply {
//            border = BorderFactory.createTitledBorder("Plot")
//            for (elem in plotButtonGroup.elements) {
//                add(elem)
//            }
//        })
//
//        // Preserve aspect ratio selector
//        val aspectRadioButtonGroup = ButtonGroup()
//        aspectRadioButtonGroup.add(JRadioButton("Original", false).apply {
//            addActionListener {
//                controller.preserveAspectRadio = true
//            }
//        })
//        aspectRadioButtonGroup.add(JRadioButton("Fit container", true).apply {
//            addActionListener {
//                controller.preserveAspectRadio = false
//            }
//        })
//
//        this.add(Box.createHorizontalBox().apply {
//            border = BorderFactory.createTitledBorder("Aspect ratio")
//            for (elem in aspectRadioButtonGroup.elements) {
//                add(elem)
//            }
//        })
//    }
//    window.contentPane.add(controlsPanel)
//
//    // Add plot panel
//    val plotContainerPanel = JPanel(GridLayout())
//    window.contentPane.add(plotContainerPanel)
//
//    controller.plotContainerPanel = plotContainerPanel
//    controller.rebuildPlotComponent()
//
//    SwingUtilities.invokeLater {
//        window.pack()
//        window.size = Dimension(850, 400)
//        window.setLocationRelativeTo(null)
//        window.isVisible = true
//    }
//}
//
//private class Controller(
//    private val plots: Map<String, Plot>,
//    initialPlotKey: String,
//    initialPreserveAspectRadio: Boolean
//) {
//    var plotContainerPanel: JPanel? = null
//    var plotKey: String = initialPlotKey
//        set(value) {
//            field = value
//            rebuildPlotComponent()
//        }
//    var preserveAspectRadio: Boolean = initialPreserveAspectRadio
//        set(value) {
//            field = value
//            rebuildPlotComponent()
//        }
//
//    fun rebuildPlotComponent() {
//        plotContainerPanel?.let {
//            val container = plotContainerPanel!!
//            // cleanup
//            for (component in container.components) {
//                if (component is Disposable) {
//                    component.dispose()
//                }
//            }
//            container.removeAll()
//
//            // build
//            container.add(createPlotPanel())
//            container.revalidate()
//        }
//    }
//
//    fun createPlotPanel(): JPanel {
//        val rawSpec = plots[plotKey]!!.toSpec()
//        val processedSpec = MonolithicCommon.processRawSpecs(rawSpec, frontendOnly = false)
//
//        return DefaultPlotPanelBatik(
//            processedSpec = processedSpec,
//            preserveAspectRatio = preserveAspectRadio,
//            preferredSizeFromPlot = false,
//            repaintDelay = 10,
//        ) { messages ->
//            for (message in messages) {
//                println("[Example App] $message")
//            }
//        }
//    }
//}
//
//data class GeomData(val layer: Layer, val xName: String, val yName: String?, val layerTypeName: String?)
//
//private fun GeomData.mapping(): AreaMapping.() -> Unit = { fill = layerTypeName }
//private fun GeomData.toLetsPlotGeom() = when (layer.geomKind) {
//    BLANK -> TODO()
//    PATH -> TODO()
//    LINE -> TODO()
//    SMOOTH -> TODO()
//    BAR -> TODO()
//    HISTOGRAM -> TODO()
//    TILE -> TODO()
//    BIN_2D -> TODO()
//    MAP -> TODO()
//    ERROR_BAR -> TODO()
//    CROSS_BAR -> TODO()
//    LINE_RANGE -> TODO()
//    POINT_RANGE -> TODO()
//    POLYGON -> TODO()
//    AB_LINE -> TODO()
//    H_LINE -> TODO()
//    V_LINE -> TODO()
//    BOX_PLOT -> TODO()
//    LIVE_MAP -> TODO()
//    POINT -> geomPoint(lpSet()) { fill = layerTypeName }
//    RIBBON -> TODO()
//    AREA -> geomArea(lpSet()) { fill = layerTypeName }
//    DENSITY -> geomDensity(lpSet()) { fill = layerTypeName }
//    CONTOUR -> TODO()
//    CONTOURF -> TODO()
//    DENSITY2D -> TODO()
//    DENSITY2DF -> TODO()
//    JITTER -> TODO()
//    FREQPOLY -> TODO()
//    STEP -> TODO()
//    RECT -> TODO()
//    SEGMENT -> TODO()
//    TEXT -> TODO()
//    RASTER -> TODO()
//    IMAGE -> TODO()
//}
