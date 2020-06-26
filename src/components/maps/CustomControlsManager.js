import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MAP } from 'react-google-maps/lib/constants';
import PropTypes from 'prop-types';

export default function CustomControlsManager(
    { position = window.google.maps.ControlPosition.TOP_LEFT, children },
    context
) {
    const map = context[MAP];

    const controlDiv = document.createElement('div');

    useEffect(() => {
        const controls = map.controls[position];
        const index = controls.length;
        controls.push(controlDiv);
        return () => {
            controls.removeAt(index);
        };
    });

    return createPortal(
        <div style={{ marginBottom: 8, marginTop: 8 }}>{children}</div>,
        controlDiv
    );
}

CustomControlsManager.contextTypes = {
    [MAP]: PropTypes.object,
};