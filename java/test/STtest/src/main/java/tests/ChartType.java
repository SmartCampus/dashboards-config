package tests;

/**
 * @author Marc Karassev
 */
public enum ChartType {

    // Constants

    LINE("line");

    // Attributes

    private String name;

    // Constructors

    ChartType(String name) {
        this.name = name;
    }

    // Methods

    @Override
    public String toString() {
        return name;
    }
}
