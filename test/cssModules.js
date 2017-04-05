import path from 'path';
import expect from 'expect';
import posthtml from 'posthtml';
import cssModules from '..';

const classesPath = path.join(__dirname, 'classes.json');
const classesDir = path.dirname(classesPath);


describe('posthtml-css-modules', () => {
    it('should inline CSS module from the file (flat config)', () => {
        return init(
            '<div class="foob" css-module="title"></div>',
            '<div class="foob __title __heading"></div>',
            classesPath
        );
    });


    it('should inline CSS module from the file (deep config)', () => {
        return init(
            '<div css-module="user.profile.photo"></div>',
            '<div class="__user__profile__photo"></div>',
            classesPath
        );
    });

    it('should inline CSS module from the file (multiple classes)', () => {
        return init(
            '<div class="foob" css-module="title color"></div>',
            '<div class="foob __title __heading __color"></div>',
            classesPath
        );
    });

    it('should do not broken if classes not trimmed', () => {
        return init(
            '<div class="foob" css-module="title color "></div>',
            '<div class="foob __title __heading __color"></div>',
            classesPath
        );
    });


    it('should inline CSS module from the directory', () => {
        return init(
            '<div css-module="classes.title"></div>',
            '<div class="__title __heading"></div>',
            classesDir
        );
    });


    it('should throw an error if the file with the CSS modules is not found', () => {
        return init(
            '<div></div>',
            '<div></div>',
            classesPath
        ).catch(error => {
            expect(error.message)
                .toInclude('Cannot find module')
                .toInclude('config/notExists.json');
        });
    });


    it('should throw an error if the CSS module is not found in the file', () => {
        return init(
            '<div css-module="notExists"></div>',
            '<div css-module="notExists"></div>',
            classesPath
        ).catch(error => {
            expect(error.message)
                .toInclude('[posthtml-css-modules] CSS module "notExists" is not found');
        });
    });


    it('should throw an error if the file with the CSS module is not found in the directory', () => {
        return init(
            '<div css-module="notExists"></div>',
            '<div css-module="notExists"></div>',
            classesDir
        ).catch(error => {
            expect(error.message)
                .toInclude('Cannot find module')
                .toInclude('test/notExists');
        });
    });
});


function init(html, expectedHtml, options) {
    return posthtml([cssModules(options)]).process(html).then(result => {
        expect(result.html).toBe(expectedHtml);
    });
}
