
class vec2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class vec3
{
    constructor(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class vec4
{
    constructor(x, y, z, w)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    dot(v)
    {
        return (this.x * v.x) + (this.y * v.y) + (this.z * v.z) + (this.w * v.w);
    }
}

class mat4
{
    constructor()
    {
        this.rows = [
            new vec4(1.0, 0.0, 0.0, 0.0),
            new vec4(0.0, 1.0, 0.0, 0.0),
            new vec4(0.0, 0.0, 1.0, 0.0),
            new vec4(0.0, 0.0, 0.0, 1.0)
        ];
    }

    dot(v)
    {
        return new vec4(
            this.rows[0].dot(v),
            this.rows[1].dot(v),
            this.rows[2].dot(v),
            this.rows[3].dot(v)
        )
    }
}

let   canvas = null;
let   ctx    = null;
const points = [];

let z_r      = 0.0;
let m_r      = new mat4();
let m_t      = new mat4();

// todo, maybe change this to init, and add a register or something function
function draw_graph(canvas_id, file)
{
    let width  = window.innerWidth;
    let height = window.innerHeight;
    let radius = 100.0;

    canvas = document.getElementById(canvas_id);
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    points.push(
        new vec3(-radius, -radius, 0.0),
        new vec3(+radius, -radius, 0.0),
        new vec3(+radius, +radius, 0.0),
        new vec3(-radius, +radius, 0.0)
    )

    m_t.rows[0].w = (width  / 2.0);
    m_t.rows[1].w = (height / 2.0);

    window.requestAnimationFrame(render);
}

function render()
{
    m_r.rows[0].x =  Math.cos(z_r);
    m_r.rows[0].y = -Math.sin(z_r);
    m_r.rows[1].x =  Math.sin(z_r);
    m_r.rows[1].y =  Math.cos(z_r);

    let p0 = m_r.dot(new vec4(points[0].x, points[0].y, 0.0, 1.0));
    let p1 = m_r.dot(new vec4(points[1].x, points[1].y, 0.0, 1.0));
    let p2 = m_r.dot(new vec4(points[2].x, points[2].y, 0.0, 1.0));
    let p3 = m_r.dot(new vec4(points[3].x, points[3].y, 0.0, 1.0));  

    p0 = m_t.dot(p0);
    p1 = m_t.dot(p1);
    p2 = m_t.dot(p2);
    p3 = m_t.dot(p3);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p0.x, p0.y);
    ctx.stroke();

    window.requestAnimationFrame(render);

    z_r += 0.0001;
}
