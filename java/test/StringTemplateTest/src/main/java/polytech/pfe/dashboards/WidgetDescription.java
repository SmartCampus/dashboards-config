package polytech.pfe.dashboards;

import org.stringtemplate.v4.*;
import java.io.*;


public class WidgetDescription
{
private String nbOfGraph;
private String yTitle;
private String dataName;

public WidgetDescription(String nbOfGraph, String yTitle, String dataName) {
	this.nbOfGraph = nbOfGraph;
	this.yTitle = yTitle;
	this.dataName = dataName;
}

public String getNbOfGraph() {
	return nbOfGraph;
}

public String getYTitle() {
	return yTitle;
}

public String getDataName() {
		return dataName;
}


}