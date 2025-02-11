import { Component } from "cc";

/**try catch */
export const TryCatch = function (ret: any) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            try {
                return originalMethod.apply(this, args);
            } catch (error) {
                return ret;
            }
        };
    };
}

export const MainThrend = function() {
    return function (target: Component, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            this.scheduleOnce(function() {
                originalMethod.apply(this, args);
            })
        };
    };
}