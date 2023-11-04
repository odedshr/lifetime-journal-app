var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
import { render } from 'nano-jsx';
import * as d3 from 'd3';
const ITEM_HEIGHT = 22;
let itemCount = 0;
let startAt = 0;
const persistentData = { type: 'number', rows: [] };
function setupChart(container, onRequestData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Declare the chart dimensions and margins.
        const { width, height } = container.getBoundingClientRect();
        // Create the SVG container.
        const svg = d3.select(container.querySelector('.chart'))
            .attr("width", width)
            .attr("height", height);
        // Generate timeline  
        const timeline = svg.append('g')
            .attr('transform', `translate(0, 0)`);
        // Scrolling
        let offset = 0;
        // @ts-ignore
        svg.call(d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (e) => __awaiter(this, void 0, void 0, function* () {
            offset = e.transform.y;
            timeline.attr('transform', `translate(0, ${offset})`);
            startAt = -Math.ceil(offset / ITEM_HEIGHT);
            // console.log('>>', offset, startAt)
            drawChart(timeline, yield onRequestData(itemCount, startAt));
        })));
        itemCount = height / ITEM_HEIGHT;
        drawChart(timeline, yield onRequestData(itemCount, startAt));
    });
}
function drawChart(timeline, data) {
    if (persistentData.type !== data.type) {
        persistentData.rows = data.rows;
        persistentData.type = data.type;
        timeline.selectAll('*').remove();
    }
    else {
        const rows = persistentData.rows;
        data.rows.forEach(item => rows.some(i => i.id === item.id) || rows.push(item));
    }
    redraw(timeline);
}
function redraw(timeline) {
    const labelWidth = 30;
    const circleRadius = 3;
    const padding = 1;
    const row = timeline.selectAll('g')
        .data(persistentData.rows)
        .enter()
        .append('g')
        .attr('transform', d => `translate(0, ${d.id * ITEM_HEIGHT})`);
    row.append('text')
        .text(d => d.label)
        .attr('class', 'row-label');
    const circles = row.selectAll('circle')
        .data(d => d.values)
        .enter()
        .append('circle')
        .attr('class', 'item')
        .attr('title', (d, i) => i)
        .attr('r', circleRadius)
        .attr('cx', (d, i) => (i * 2 * (circleRadius + padding)) + labelWidth)
        .attr('cy', (padding));
    if (persistentData.type === 'number') {
        const [min, max] = [persistentData.min, persistentData.max];
        const linearScale = d3.scaleLinear()
            .domain(!!min && !!max ? [min, max] : [0, 1])
            .range([0, 1]);
        circles.attr('fill', d => d.happened ? 'black' : 'white');
        // circles.attr('fill', d => {
        //   const c = Math.round(linearScale(+d) * 155);
        //   return `rgb(${c}, ${c}, ${c})`
        // });
    }
    else if (persistentData.type === 'color') {
        circles.attr('fill', d => d.value);
    }
}
const Element = (props) => {
    let container;
    let svgElement;
    setTimeout(() => {
        container.scrollTo(0, 200);
        setupChart(container, props.onRequestData);
    }, 5);
    return (_jsxs("main", { class: "overview", children: [_jsx("header", {}), _jsx("article", { class: "chart-container", ref: (el) => container = el, children: _jsx("svg", { class: "chart", ref: (el) => svgElement = el }) }), _jsx("footer", {})] }));
};
function appendChild(parent, props) {
    render(_jsx(Element, Object.assign({}, props)), parent);
}
export { appendChild };
