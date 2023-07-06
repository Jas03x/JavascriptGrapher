
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
        );
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

    static translate(x, y, z)
    {
        let m = new mat4();
        m.rows[0].w = x;
        m.rows[1].w = y;
        m.rows[2].w = z;
        return m;
    }

    static project(aspect_ratio, fov, z_near, z_far)
    {
        let m = new mat4();
        let inv_tan_fov = 1.0 / Math.tan(fov);
        m.rows[0].x = inv_tan_fov / aspect_ratio;
        m.rows[1].y = inv_tan_fov;
        m.rows[2].z = z_far / (z_far - z_near);
        m.rows[2].w = -(z_far / (z_far - z_near)) * z_near;
        m.rows[3].z = 1.0;
        m.rows[3].w = 0.0;
        return m;
    }
}

let graph_callback_array = [];
let graph_animation_frame_requested = false;

class graph_context
{
    constructor(canvas_id)
    {
        this.canvas = document.getElementById(canvas_id);
        this.canvas.width = this.canvas.getBoundingClientRect().width;
        this.canvas.height = this.canvas.getBoundingClientRect().height;

        this.context = this.canvas.getContext("2d");

        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    set_draw_callback(on_draw)
    {
        graph_callback_array.push([on_draw, this]);

        if (!graph_animation_frame_requested)
        {
            window.requestAnimationFrame(render_graphs);
            graph_animation_frame_requested = true;
        }
    }
}

function initialize_graph_context(canvas_id)
{
    return new graph_context(canvas_id);
}

function render_graphs()
{
    for (let i = 0; i < graph_callback_array.length; i++)
    {
        graph_callback_array[i][0](graph_callback_array[i][1].context);
    }

    window.requestAnimationFrame(render_graphs);
}
