
class vec2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    dot(v)
    {
        return (this.x * v.x) + (this.y * v.y);
    }

    length()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    mul(s)
    {
        this.x *= s;
        this.y *= s;
        return this;
    }

    static normalize(v)
    {
        var f = 1.0 / v.length();
        return new vec2(v.x * f, v.y * f);
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

    dot(v)
    {
        return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
    }

    cross(v)
    {
        return new vec3(
            this.y*v.z - this.z*v.y,
            -this.x*v.z + this.z*v.x,
            this.x*v.y - this.y*v.x
        );
    }

    length()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }

    mul(s)
    {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    static normalize(v)
    {
        var f = 1.0 / v.length();
        return new vec3(v.x * f, v.y * f, v.z * f);
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

    length()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
    }

    mul(s)
    {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    }

    static normalize(v)
    {
        var f = 1.0 / v.length();
        return new vec2(v.x * f, v.y * f, v.z * f, v.w * f);
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
        var m_t = new mat4();
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
        var m_r = new mat4();
        var m_t = m.transpose();

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
        var m = new mat4();
        m.rows[0].w = x;
        m.rows[1].w = y;
        m.rows[2].w = z;
        return m;
    }

    static project(aspect_ratio, fov, z_near, z_far)
    {
        var m = new mat4();
        var inv_tan_fov = 1.0 / Math.tan(fov);
        m.rows[0].x = inv_tan_fov / aspect_ratio;
        m.rows[1].y = inv_tan_fov;
        m.rows[2].z = z_far / (z_far - z_near);
        m.rows[2].w = -(z_far / (z_far - z_near)) * z_near;
        m.rows[3].z = 1.0;
        m.rows[3].w = 0.0;
        return m;
    }

    static view(p, t, u) // position, target, up
    {
        var m = new mat4(1.0);

        var fwd = vec3.normalize(new vec3(t.x - p.x, t.y - p.y, t.z - p.z)); // forward vector
        var side = vec3.normalize(fwd.cross(u)); // side vector
        var up = vec3.normalize(side.cross(fwd)); // up vector
        
        m.rows = [
            new vec4(side.x, up.x, fwd.x, 0.0),
            new vec4(side.y, up.y, fwd.y, 0.0),
            new vec4(side.z, up.z, fwd.z, 0.0),
            new vec4(-side.dot(p), -up.dot(p), fwd.dot(p), 1.0)
        ];

        console.log(m);

        return m;
    }
}

class line
{
    constructor(v0, v1)
    {
        this.v0 = v0;
        this.v1 = v1;
    }
}

var graph_callback_array = [];
var graph_animation_frame_requested = false;

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
    for (var i = 0; i < graph_callback_array.length; i++)
    {
        graph_callback_array[i][0](graph_callback_array[i][1].context);
    }

    window.requestAnimationFrame(render_graphs);
}

function draw_line(ctx, m, line)
{
    var v0 = m.dot(new vec4(line.v0.x, line.v0.y, line.v0.z, 1.0));
    var v1 = m.dot(new vec4(line.v1.x, line.v1.y, line.v1.z, 1.0));

    v0 = v0.mul(1.0 / v0.w);
    v1 = v1.mul(1.0 / v1.w);
    
    v0.x = (v0.x + 1.0) * 0.5 * canvas.width;
    v0.y = (v0.y + 1.0) * 0.5 * canvas.height;

    v1.x = (v1.x + 1.0) * 0.5 * canvas.width;
    v1.y = (v1.y + 1.0) * 0.5 * canvas.height;

    ctx.beginPath();
    ctx.moveTo(v0.x ,v0.y);
    ctx.lineTo(v1.x ,v1.y);
    ctx.stroke();
}
