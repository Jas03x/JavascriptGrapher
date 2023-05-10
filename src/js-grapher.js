
class vec2
{
    constructor(x = 0.0, y = 0.0)
    {
        this.x = x;
        this.y = y;
    }
}

function draw_graph(canvas_id, file)
{
    let width  = window.innerWidth;
    let height = window.innerHeight;
    let radius = 100.0;

    const canvas = document.getElementById(canvas_id);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    const point_array = [
        new vec2((width / 2) - radius, (height / 2) - radius),
        new vec2((width / 2) + radius, (height / 2) - radius),
        new vec2((width / 2) + radius, (height / 2) + radius),
        new vec2((width / 2) - radius, (height / 2) + radius)
    ];

    ctx.beginPath();
    ctx.moveTo(point_array[0].x, point_array[0].y);
    ctx.lineTo(point_array[1].x, point_array[1].y);
    ctx.lineTo(point_array[2].x, point_array[2].y);
    ctx.lineTo(point_array[3].x, point_array[3].y);
    ctx.lineTo(point_array[0].x, point_array[0].y);
    ctx.stroke();
}
