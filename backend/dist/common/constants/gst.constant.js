"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INDIAN_STATE_CODE_MESSAGE = exports.INDIAN_STATE_CODE_PATTERN = exports.GST_NUMBER_MESSAGE = exports.GST_NUMBER_PATTERN = void 0;
exports.GST_NUMBER_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
exports.GST_NUMBER_MESSAGE = 'GST number must be a valid 15-character GSTIN';
exports.INDIAN_STATE_CODE_PATTERN = /^\d{2}$/;
exports.INDIAN_STATE_CODE_MESSAGE = 'State code must contain exactly 2 digits';
//# sourceMappingURL=gst.constant.js.map