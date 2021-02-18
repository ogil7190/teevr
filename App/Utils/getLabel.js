import { enLabels } from 'App/Constants/enLabels';
import { isEmpty } from 'lodash';

export function getLabel( labelKey ){
    /* read current language selection of the user and export the required label */
    const selectedLabelPack = enLabels;
    const label = selectedLabelPack[ labelKey ];
    return isEmpty ( label ) ? '-' : label ;
}