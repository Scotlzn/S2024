function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Boid {

    TOP_SPEED = 150;
    RESOLVE = 0.1;
    RANGE = 50;
    SEPARATION = 0.5;
    COHESION = 0.05;
    ALIGNMENT = 0.03;

    constructor() {
        this.x = get_random_int(20, 380);
        this.y = get_random_int(20, 380);
        this.width = 13;
        this.height = 11;
        this.direction = get_random_int(-180, 180);
        this.velocity = [get_random_int(-60, 60), get_random_int(-60, 60)];
    }

    process_surroundings(others) {
        let boid_count = 0;
        let sum_x = 0;
        let sum_y = 0;
        let sum_vel_x = 0;
        let sum_vel_y = 0;
        others.forEach((boid) => {
            if (this != boid) {
                let distance_x = boid.x - this.x;
                let distance_y = boid.y - this.y;
                let distance = Math.sqrt((distance_x ** 2) + (distance_y ** 2));
                if (distance < this.RANGE) {
                    boid_count++;
                    sum_x += distance_x;
                    sum_y += distance_y;
                    sum_vel_x += (boid.velocity[0] - this.velocity[0]);
                    sum_vel_y += (boid.velocity[1] - this.velocity[1]);
                    this.velocity[0] += ((-this.SEPARATION) * (distance_x / distance));
                    this.velocity[1] += ((-this.SEPARATION) * (distance_y / distance));
                }
            }
        });
        if (boid_count > 0) {
            this.velocity[0] += (this.COHESION * (sum_x / boid_count));
            this.velocity[1] += (this.COHESION * (sum_y / boid_count));
            this.velocity[0] += (this.ALIGNMENT * (sum_vel_x / boid_count));
            this.velocity[1] += (this.ALIGNMENT * (sum_vel_y / boid_count));
        }
    }

    move(dt) {
        let distance = Math.sqrt(((-this.velocity[0]) ** 2) + ((-this.velocity[1]) ** 2));
        let target = ((this.velocity[0] / distance) * this.TOP_SPEED);
        this.velocity[0] += (this.RESOLVE * (target - this.velocity[0])) * dt;
        target = ((this.velocity[1] / distance) * this.TOP_SPEED);
        this.velocity[1] += (this.RESOLVE * (target - this.velocity[1])) * dt;

        this.x += this.velocity[0] * dt;
        this.y += this.velocity[1] * dt;

        this.direction = Math.atan2(this.velocity[1], this.velocity[0]) * (180 / Math.PI);

        if (this.direction < 0) {
            this.direction += 360;
        }

        this.bounds_check();
    }

    update(dt, others) {
        this.process_surroundings(others);
        this.move(dt);
    }

    bounds_check() {
        let limit = 400;
        if (this.x < (-this.width)) {
            this.x = limit;
        } else if (this.x > limit) {
            this.x = (-this.width);
        } else if (this.y < (-this.height)) {
            this.y = limit;
        } else if (this.y > limit) {
            this.y = (-this.height);
        }
    }
}