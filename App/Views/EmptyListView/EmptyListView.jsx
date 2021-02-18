import React from 'react';
import { get, Keys } from 'Utils/localDataManager';
import { avatars } from 'Models/avatars';
import { NeomorphRing } from 'Views/ProgressScreenView';
import { View, Text} from 'react-native';
import { normalizeWidth, Fonts } from 'App/Theme/Fonts';
import { Colors } from 'App/Theme/Colors';
import { Icon } from 'Components/Icon';

export const EmptyListView = ({ hideContent = false }) => {
    const { selectedAvatar } = get(Keys.SESSION_DATA_DETAILS);
    const avatar = avatars[ selectedAvatar ];

    const quotes = [
        '"Arise, awake and do not stop until\nthe goal is reached."    -Vivekananda',
        '"Don\'t be dead serious about your life.\nIt is just a play."   -Sadhguru',
        '"Hard work never brings fatigue.\nIt brings satisfaction."   -Narendra Modi',
        '"In a gentle way you can shake\nthe world."    - Mahatma Gandhi',
        '"Stay away from negative people\nthey have problem from every solution."  -Eintsein',
        '"I do not think you can name many\ngreat inventions that have been made\nby married men."   -Nikola Tesla'
    ]

    const randomIndex = Math.floor( Math.random() * quotes.length );

    return(
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: normalizeWidth(-50), width: '100%', height: '100%' }}>
            { !hideContent &&
                <NeomorphRing reverse={true} hideInternal={true} outerSize={100} >
                    <Icon name={avatar} fill={Colors.grey} width={80} height={80} />
                </NeomorphRing>
            }

            <Text style={{ fontSize: Fonts.FONT_SIZE_14, textAlign: 'center', marginTop: 10, color: Colors.grey, fontFamily: Fonts.FONT_TYPE_PUBLIC_SANS_LIGHT}}>
                {'No Data Found\n\n'}
                {
                    !hideContent &&
                    <Text>
                        { quotes[ randomIndex] }
                    </Text>
                }
            </Text>
        </View>
    )
}