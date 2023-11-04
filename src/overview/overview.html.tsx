import { render } from 'nano-jsx';
import * as d3 from 'd3';

type CellData<T> = { value: T, happened: boolean }
type RowData<T> = { id: number, label: string, values: CellData<T>[] }


type Data<T> = {
  type: 'number' | 'color'
  rows: RowData<T>[];
  min?: number;
  max?: number;
}

type OnRequestData = (itemCount: number, startAt: number) => Promise<Data<any>>;

type Props = {
  onRequestData: OnRequestData
};

type ElementType = (props: Props) => HTMLElement;

const ITEM_HEIGHT = 22;
let itemCount: number = 0;
let startAt: number = 0;
const persistentData: Data<number> = { type: 'number', rows: [] };

async function setupChart(container: HTMLElement, onRequestData: OnRequestData) {
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
  let offset: number = 0;

  // @ts-ignore
  svg.call(d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([1, 8])
    .on('zoom', async (e) => {
      offset = e.transform.y;
      timeline.attr('transform', `translate(0, ${offset})`);
      startAt = -Math.ceil(offset / ITEM_HEIGHT);
      // console.log('>>', offset, startAt)
      drawChart(timeline, await onRequestData(itemCount, startAt));
    }));

  itemCount = height / ITEM_HEIGHT
  drawChart(timeline, await onRequestData(itemCount, startAt));
}

function drawChart(timeline: d3.Selection<SVGGElement, unknown, null, undefined>, data: Data<any>) {
  if (persistentData.type !== data.type) {
    persistentData.rows = data.rows;
    persistentData.type = data.type;
    timeline.selectAll('*').remove();
  } else {
    const rows = persistentData.rows;
    data.rows.forEach(item => rows.some(i => i.id === item.id) || rows.push(item));
  }


  redraw(timeline);
}

function redraw(timeline: d3.Selection<SVGGElement, unknown, null, undefined>) {
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

  } else if (persistentData.type === 'color') {
    circles.attr('fill', d => d.value);
  }
}

const Element: ElementType = (props: Props) => {
  let container: HTMLElement;
  let svgElement: SVGSVGElement

  setTimeout(() => {
    container.scrollTo(0, 200);
    setupChart(container, props.onRequestData);
  }, 5);

  return (<main class="overview">
    <header></header>
    <article class="chart-container" ref={(el: HTMLElement) => container = el}>
      <svg class="chart" ref={(el: SVGSVGElement) => svgElement = el}></svg>
    </article>
    <footer></footer>
  </main>);
}

function appendChild(parent: HTMLElement, props: Props) {

  render(<Element {...props} />, parent);
}

export { appendChild, Data };