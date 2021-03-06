'use strict';
var $metadata = require('../../db-utils/metadata'),
    $sublist = require('../../ctx-utils/sublist');

exports.$$hook = true;

exports.nlapiSetLineItemValue = (ctx) => {

    /**
     * Return the value of a sublist field on the current record on a page.
     * @restriction supported in client and user event scripts only.
     * @param {string}    type sublist name
     * @param {string}    fldnam sublist field name
     * @param {int}    linenum line number (1-based)
     * @return {string}
     *
     * @since 2005.0
     */
    return (type, fldnam, linenum, value) => {
        let $this = ctx.$$THIS_RECORD || {},
            recType = $this.recordType;
        $metadata.existsSubList(recType, type);

        let recSubType = $sublist.dbName($this, type),
            collection = $db(recSubType),
            query = {_index: linenum},
            record = collection.chain().filter(query).value(),
            line = Array.isArray(record) ? record[0] : record;

        if (line) {
            line[fldnam] = value;

            collection.chain().filter(query).assign(line).value();
            $db.write();
            if (value) {
                return '' + value;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
};