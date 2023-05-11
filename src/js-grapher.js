
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

    transpose()
    {
        let m_t = new mat4();
        m_t.rows[0] = new vec4(this.rows[0].x, this.rows[1].x, this.rows[2].x, this.rows[3].x);
        m_t.rows[1] = new vec4(this.rows[0].y, this.rows[1].y, this.rows[2].y, this.rows[3].y);
        m_t.rows[2] = new vec4(this.rows[0].z, this.rows[1].z, this.rows[2].z, this.rows[3].z);
        m_t.rows[3] = new vec4(this.rows[0].w, this.rows[1].w, this.rows[2].w, this.rows[3].w);
        return m_t;
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

    mul(m)
    {
        let m_r = new mat4();
        let m_t = m.transpose();

        m_r.rows[0].x = this.rows[0].dot(m_t.rows[0]);
        m_r.rows[0].y = this.rows[0].dot(m_t.rows[1]);
        m_r.rows[0].z = this.rows[0].dot(m_t.rows[2]);
        m_r.rows[0].w = this.rows[0].dot(m_t.rows[3]);

        m_r.rows[1].x = this.rows[1].dot(m_t.rows[0]);
        m_r.rows[1].y = this.rows[1].dot(m_t.rows[1]);
        m_r.rows[1].z = this.rows[1].dot(m_t.rows[2]);
        m_r.rows[1].w = this.rows[1].dot(m_t.rows[3]);

        m_r.rows[2].x = this.rows[2].dot(m_t.rows[0]);
        m_r.rows[2].y = this.rows[2].dot(m_t.rows[1]);
        m_r.rows[2].z = this.rows[2].dot(m_t.rows[2]);
        m_r.rows[2].w = this.rows[2].dot(m_t.rows[3]);

        m_r.rows[3].x = this.rows[3].dot(m_t.rows[0]);
        m_r.rows[3].y = this.rows[3].dot(m_t.rows[1]);
        m_r.rows[3].z = this.rows[3].dot(m_t.rows[2]);
        m_r.rows[3].w = this.rows[3].dot(m_t.rows[3]);

        return m_r;
    }
}

let   canvas   = null;
let   ctx      = null;
const vertices = [];

let z_r        = 0.0;
let m_r        = new mat4(); // rotation matrix
let m_t        = new mat4(); // translation matrix
let m_p        = new mat4(); // projection matrix

// todo, maybe change this to init, and add a register or something function
function draw_graph(canvas_id, file)
{
    let width  = window.innerWidth;
    let height = window.innerHeight;
    let radius = 1.0;

    canvas = document.getElementById(canvas_id);
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    vertices.push(
        new vec4(-radius, -radius, +radius, 1.0),
        new vec4(+radius, -radius, +radius, 1.0),
        new vec4(+radius, +radius, +radius, 1.0),
        new vec4(-radius, +radius, +radius, 1.0),
        new vec4(-radius, -radius, -radius, 1.0),
        new vec4(+radius, -radius, -radius, 1.0),
        new vec4(+radius, +radius, -radius, 1.0),
        new vec4(-radius, +radius, -radius, 1.0)
    )

    m_t.rows[0].w = 0.0;
    m_t.rows[1].w = 0.0;
    m_t.rows[2].w = -100.0;

    let fov = 1.0 / Math.tan(Math.PI / 4.0);
    let aspect_ratio = width / height;
    let z_near = 0.1;
    let z_far = 10.0;

    m_p.rows[0].x = fov / aspect_ratio;
    m_p.rows[1].y = fov;
    m_p.rows[2].z = z_far / (z_far - z_near);
    m_p.rows[2].w = 1.0;
    m_p.rows[3].z = -(z_far / (z_far - z_near)) * z_near;

    window.requestAnimationFrame(render);
}

function render()
{
    m_r.rows[0].x =  Math.cos(z_r);
    m_r.rows[0].z =  Math.sin(z_r);
    m_r.rows[2].x = -Math.sin(z_r);
    m_r.rows[2].z =  Math.cos(z_r);

    //let m = m_r.mul(m_t);
    let m = m_t.mul(m_r);

    console.log(m);
    
    let transformed_vertices = Array(vertices.length);

    for (let i = 0; i < transformed_vertices.length; i++)
    {
        transformed_vertices[i] = m.dot(vertices[i]);
    }

    for (let i = 0; i < transformed_vertices.length; i++)
    {
        transformed_vertices[i] = m_p.dot(transformed_vertices[i]);
    }

    for (let i = 0; i < transformed_vertices.length; i++)
    {
        transformed_vertices[i].x = (transformed_vertices[i].x + 1.0) * 0.5 * canvas.width;
        transformed_vertices[i].y = (transformed_vertices[i].y + 1.0) * 0.5 * canvas.height;

        transformed_vertices[i].x /= transformed_vertices[i].w;
        transformed_vertices[i].y /= transformed_vertices[i].w;
        transformed_vertices[i].z /= transformed_vertices[i].w;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(transformed_vertices[0].x, transformed_vertices[0].y);
    ctx.lineTo(transformed_vertices[1].x, transformed_vertices[1].y);
    ctx.lineTo(transformed_vertices[2].x, transformed_vertices[2].y);
    ctx.lineTo(transformed_vertices[3].x, transformed_vertices[3].y);
    ctx.lineTo(transformed_vertices[0].x, transformed_vertices[0].y);

    ctx.moveTo(transformed_vertices[4].x, transformed_vertices[4].y);
    ctx.lineTo(transformed_vertices[5].x, transformed_vertices[5].y);
    ctx.lineTo(transformed_vertices[6].x, transformed_vertices[6].y);
    ctx.lineTo(transformed_vertices[7].x, transformed_vertices[7].y);
    ctx.lineTo(transformed_vertices[4].x, transformed_vertices[4].y);

    ctx.moveTo(transformed_vertices[0].x, transformed_vertices[0].y);
    ctx.lineTo(transformed_vertices[4].x, transformed_vertices[4].y);
    ctx.moveTo(transformed_vertices[3].x, transformed_vertices[3].y);
    ctx.lineTo(transformed_vertices[7].x, transformed_vertices[7].y);
    ctx.moveTo(transformed_vertices[1].x, transformed_vertices[1].y);
    ctx.lineTo(transformed_vertices[5].x, transformed_vertices[5].y);
    ctx.moveTo(transformed_vertices[2].x, transformed_vertices[2].y);
    ctx.lineTo(transformed_vertices[6].x, transformed_vertices[6].y);

    ctx.stroke();

    window.requestAnimationFrame(render);

    z_r += 0.001;
}
