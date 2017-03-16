/**
 * typings.d.ts - creates a module to import a JSON file
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

declare module "*.json" {
    const value: any;
    export default value;
}
