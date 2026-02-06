import * as d3 from "d3";

interface ParameterType {
  label: string;
  name: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  value: number;
}

export default function (params) {
  d3.select("main").append("form");
  const urlsearch = new URLSearchParams(window.location.search);

  const inputItems = d3
    .select("form")
    .selectAll("dl")
    .data<ParameterType>(params)
    .enter()
    .append("dl")
    .attr("id", (d) => d.name)
    .attr("class", "parameter");

  inputItems
    .append("label")
    .attr("class", "value")
    .attr("for", (d) => d.name)
    .text((d) => d.value);

  inputItems
    .append("dt")
    .append("label")
    .attr("class", "name")
    .attr("for", (d) => d.name)
    .html((d) => d.label);

  const inputRanges = inputItems.append("dd").attr("class", "param_range");
  inputRanges
    .append("input")
    .attr("type", "range")
    .attr("name", (d) => d.name)
    .attr("min", (d) => d.min)
    .attr("max", (d) => d.max)
    .attr("step", (d) => d.step)
    .attr("value", (d) => d.value)
    .on("input", function (_event, d) {
      urlsearch.set(d.symbol, this.value);
      window.history.replaceState(null, "", `?${urlsearch.toString()}`);
      d3.select(`#${this.name} label.value`).text(this.value);
      d.value = Number(this.value);
      if (this.name === "popsize") {
        d3.select("#frequency input").attr("max", d.value);
        d3.select("#frequency label.max").text(d.value);
        if (d.value < params[2].value) {
          params[2].value = d.value;
          d3.select("#frequency label.value").text(d.value);
        }
      }
    });
  inputRanges
    .append("label")
    .attr("class", "min")
    .attr("for", (d) => d.name)
    .text((d) => d.min);
  inputRanges
    .append("label")
    .attr("class", "max")
    .attr("for", (d) => d.name)
    .text((d) => d.max);

  const inputModel = d3.select("form").append("dl").attr("class", "model");
  inputModel.append("dt").append("label").attr("class", "name").text("Model");
  inputModel.append("dd").each(function () {
    d3.select(this)
      .append("input")
      .attr("type", "radio")
      .attr("name", "model")
      .attr("value", "wrightFisherHaploid")
      .attr("id", "wrightFisherHaploid");
    d3.select(this)
      .append("label")
      .attr("class", "radio")
      .attr("for", "wrightFisherHaploid")
      .text("Wright-Fisher haploid");
    d3.select(this).append("br");
    d3.select(this)
      .append("input")
      .attr("type", "radio")
      .attr("name", "model")
      .attr("value", "wrightFisherDiploid")
      .attr("id", "wrightFisherDiploid");
    d3.select(this)
      .append("label")
      .attr("class", "radio")
      .attr("for", "wrightFisherDiploid")
      .text("Wright-Fisher diploid (h=0.5)");
    d3.select(this).append("br");
    d3.select(this)
      .append("input")
      .attr("type", "radio")
      .attr("name", "model")
      .attr("value", "heterozygoteAdvantage")
      .attr("id", "heterozygoteAdvantage");
    d3.select(this)
      .append("label")
      .attr("class", "radio")
      .attr("for", "heterozygoteAdvantage")
      .text("Wright-Fisher heterozygote advantage");
    d3.select(this).append("br");
    d3.select(this)
      .append("input")
      .attr("type", "radio")
      .attr("name", "model")
      .attr("value", "moranHaploid")
      .attr("id", "moranHaploid");
    d3.select(this)
      .append("label")
      .attr("class", "radio")
      .attr("for", "moranHaploid")
      .text("Moran haploid");
  });
  d3.selectAll('input[name="model"]').on("change", function () {
    urlsearch.set("model", this.value);
    window.history.replaceState(null, "", `?${urlsearch.toString()}`);
  });
  const model = urlsearch.get("model") || "wrightFisherHaploid";
  d3.select(`input#${model}`).property("checked", true);

  d3.select("form")
    .append("button")
    .attr("type", "button")
    .attr("class", "start button")
    .text("START!");
}
