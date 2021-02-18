import React from 'react';
import {ActivityIndicator} from 'react-native';
import { Colors } from 'App/Theme/Colors';
import { NeomorphRing } from 'Views/ProgressScreenView';

export const WithLoading = (props) => {
	return (props.loading ?
		<NeomorphRing outerSize={60} hideInternal={true} reverse={true}>
			<ActivityIndicator
				color = {Colors.primary}
				size = {props.size || 'large'}
			/>
		</NeomorphRing> : props.children
	)
}