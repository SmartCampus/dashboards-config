package polytech.pfe.dashboards;

import org.apache.velocity.app.Velocity;
import org.apache.velocity.VelocityContext;
import java.io.*;


/**
 * Hello world!
 *
 */
public class App 
{
    public static void main ( String[] args )throws Exception
    {
	System.out.println("Hello world !");
	
	 /* first, we init the runtime engine.  Defaults are fine. */
        Velocity.init();

        /* lets make a Context and put data into it */
        VelocityContext context = new VelocityContext();

        context.put("name", "Velocity");
        context.put("project", "Jakarta");

        /* lets render a template */
        StringWriter w = new StringWriter();
		
		if (Velocity.templateExists("hello.vm")) {
			Velocity.mergeTemplate("hello.vm", context, w );
			System.out.println(" template : " + w );
		}
		else {
			System.out.println("The template hello.vm is not found in the resource files !");
		}

        /* lets make our own string to render */
        String s = "We are using $project $name to render this.";
        w = new StringWriter();
        Velocity.evaluate( context, w, "mystring", s );
        System.out.println(" string : " + w );
	
	}
	
	
}
