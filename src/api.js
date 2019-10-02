import urls from '@/urls';
import api from 'axios';

let HOST = ''

export function getChildren(path) {
    return api.post(HOST + urls.children, {path: path})
}


export function createChild(path, name, value, auth, options) {
    return api.post(HOST + urls.create_child,
        {path: path, name: name, value: value, auth: auth, options: options})
}

export function deleteNode(path, auth, options) {
    return api.post(HOST + urls.delete_node, {path: path, auth: auth, options: options})
}

export function writeNode(path, value, auth, options) {
    return api.post(HOST + urls.write_node, {path: path, value: value, auth: auth, options: options})
}
