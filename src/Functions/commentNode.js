/**
 * Create comment node
 *
 * @private
 * @author https://stackoverflow.com/questions/43003976/a-custom-directive-similar-to-v-if-in-vuejs#43543814
 */
export default function commentNode(el, vnode) {
    const comment = document.createComment(' ');

    Object.defineProperty(comment, 'setAttribute', {
        value: () => undefined
    });

    vnode.text = ' ';
    vnode.elm = comment;
    vnode.tag = undefined;
    vnode.isComment = true;
    vnode.context = undefined;
    vnode.data.directives = undefined;

    if(vnode.componentInstance) {
        vnode.componentInstance.$el = comment;
    }

    if(el.parentNode) {
        el.parentNode.replaceChild(comment, el);
    }
}