
function draw_graph(canvas_id, file)
{
    const canvas = document.getElementById(canvas_id);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "green";
    ctx.fillRect(10, 10, 1000, 1000);
}
