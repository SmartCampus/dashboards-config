package tests;

import org.stringtemplate.v4.ST;
import org.stringtemplate.v4.STGroup;
import org.stringtemplate.v4.STGroupFile;

import javax.ws.rs.POST;
import javax.ws.rs.Path;

/**
 * @author Marc Karassev
 */
@Path("generation")
public class App {

    @POST
    @Path("configMessage")
    public String postConfigMessage() {
        STGroup group = new STGroupFile("templates/curve_graph.stg");
        ST st = group.getInstanceOf("curve_graph");

        st.add(CurveGraph.TEMPLATE_ATTRIBUTE, new CurveGraph("c1", ChartType.LINE, "Temperature (°C)",
                "temperaturesArray"));
        return st.render();
    }
}
