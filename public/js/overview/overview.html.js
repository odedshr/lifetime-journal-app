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
import { isFirstDateBeforeSecondDate } from '../utils/date-utils.js';
const PADDING = 2;
const ITEM_RADIUS = 10;
const ITEM_WIDTH = (ITEM_RADIUS + PADDING) * 2;
const ITEM_HEIGHT = ITEM_WIDTH * 2;
const FONT_SIZE = Math.min(ITEM_WIDTH, ITEM_HEIGHT) * 0.5;
let rowCount = 1;
let colCount = 1;
let itemCount = 0;
let startAt = 0;
const persistentData = { type: 'number', days: [], now: new Date() };
function setupChart(container, onRequestData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Declare the chart dimensions and margins.
        const { width, height } = container.getBoundingClientRect();
        // Create the SVG container.
        const svg = d3.select(container.querySelector('.chart'))
            .attr("width", width)
            .attr("height", height);
        // Generate timeline  
        const timeline = svg.append('g').attr('transform', `translate(0, 0)`);
        rowCount = Math.floor(height / ITEM_HEIGHT);
        colCount = Math.floor(width / ITEM_WIDTH);
        itemCount = rowCount * colCount;
        console.log({ rowCount, colCount });
        // Scrolling
        let offset = 0;
        // @ts-ignore
        svg.call(d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (e) => __awaiter(this, void 0, void 0, function* () {
            offset = e.transform.y;
            timeline.attr('transform', `translate(0, ${offset})`);
            startAt = -Math.ceil(offset / ITEM_HEIGHT);
            drawChart(timeline, yield onRequestData(itemCount, startAt));
        })));
        drawChart(timeline, yield onRequestData(itemCount, startAt));
    });
}
function drawChart(timeline, data) {
    if (persistentData.type !== data.type) {
        persistentData.days = data.days;
        persistentData.type = data.type;
        persistentData.now = data.now;
        timeline.selectAll('*').remove();
    }
    else {
        const days = persistentData.days;
        data.days.forEach(item => days.some(d => d.date.getTime() === item.date.getTime()) || days.push(item));
    }
    redraw(timeline);
}
function redraw(timeline) {
    const items = timeline.selectAll('g')
        .data(persistentData.days)
        .enter()
        .append('g')
        .attr('class', 'item')
        .attr('data-val', (d, i) => `${i}/${rowCount}=${Math.floor(i / rowCount)}`)
        .attr('transform', (d, i) => {
        const x = (i % colCount) * ITEM_WIDTH + ITEM_WIDTH / 2;
        const y = Math.floor(i / colCount) * ITEM_HEIGHT + ITEM_HEIGHT / 2;
        return `translate(${x},${y})`;
    });
    items.filter(d => d.date.getMonth() === 0 && d.date.getDate() === 1).append('text')
        .text(d => d.date.toLocaleString('default', { year: '2-digit' }))
        .classed('label-year', true)
        .attr('text-anchor', 'left')
        .attr('font-size', FONT_SIZE * 4)
        .attr('y', ITEM_RADIUS)
        .attr('x', -ITEM_RADIUS);
    items.append('circle')
        .attr('class', 'item-circle')
        .attr('r', Math.min(ITEM_WIDTH, ITEM_HEIGHT) * 0.4)
        .attr('fill', d => {
        const color = Math.floor(d.value * 255);
        return `rgba(${color},${color},${color})`;
    });
    items.append('text')
        .text(d => d.date.getDate())
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', FONT_SIZE);
    items.filter(d => isFirstDateBeforeSecondDate(d.date, persistentData.now))
        .append('line')
        .attr('x1', -5)
        .attr('y1', -5)
        .attr('x2', 5)
        .attr('y2', 5)
        .attr('stroke', 'red')
        .attr('stroke-width', 2);
    items.filter(d => d.date.getDate() === 1).append('text')
        .text(d => d.date.toLocaleString('default', { month: 'short' }))
        .classed('label-month', true)
        .attr('text-anchor', 'left')
        .attr('font-size', FONT_SIZE)
        .attr('y', -(ITEM_RADIUS * 2))
        .attr('x', -ITEM_RADIUS);
    // Add circles for each item
    // grid.selectAll('circle')
    //   .data(items)
    //   .enter()
    //   .append('circle')
    //   .attr('cx', (d, i) => (i % numberOfColumns) * cellWidth + cellWidth / 2)
    //   .attr('cy', (d, i) => Math.floor(i / numberOfColumns) * cellHeight + cellHeight / 2)
    //   .attr('r', Math.min(cellWidth, cellHeight) * 0.4)
    //   .attr('fill', 'steelblue');
    // row.append('text')
    //   .text(d => d.label)
    //   .attr('class', 'row-label');
    // const circles = row.selectAll('circle')
    //   .data(d => d.values)
    //   .enter()
    //   .append('circle')
    //   .attr('class', 'item')
    //   .attr('title', (d, i) => i)
    //   .attr('r', circleRadius)
    //   .attr('cx', (d, i) => (i * 2 * (circleRadius + padding)) + labelWidth)
    //   .attr('cy', (padding));
    // if (persistentData.type === 'number') {
    //   const [min, max] = [persistentData.min, persistentData.max];
    //   const linearScale = d3.scaleLinear()
    //     .domain(!!min && !!max ? [min, max] : [0, 1])
    //     .range([0, 1]);
    //   circles.attr('fill', d => d.happened ? 'black' : 'white');
    //   // circles.attr('fill', d => {
    //   //   const c = Math.round(linearScale(+d) * 155);
    //   //   return `rgb(${c}, ${c}, ${c})`
    //   // });
    // } else if (persistentData.type === 'color') {
    //   circles.attr('fill', d => d.value);
    // }
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
