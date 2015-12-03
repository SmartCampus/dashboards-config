package tests;

/**
 * @author Marc Karassev
 */
public class CurveGraph {

    // Constants

    public static final String TEMPLATE_ATTRIBUTE = "curveGraph";

    // Attributes

    private String id;
    private ChartType type;
    private String yText;
    private String seriesName;

    // Constructors

    public CurveGraph(String id, ChartType type, String yText, String seriesName) {
        this.id = id;
        this.type = type;
        this.yText = yText;
        this.seriesName = seriesName;
    }

    // Methods

    @Override
    public String toString() {
        return "CurveGraph " + id;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public ChartType getType() {
        return type;
    }

    public String getyText() {
        return yText;
    }

    public String getSeriesName() {
        return seriesName;
    }
}
