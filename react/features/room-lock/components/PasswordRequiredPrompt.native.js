// @flow

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setPassword } from '../../base/conference';
import { Dialog } from '../../base/dialog';

/**
 * {@code PasswordRequiredPrompt}'s React {@code Component} prop types.
 */
type Props = {

    /**
     * The {@code JitsiConference} which requires a password.
     *
     * @type {JitsiConference}
     */
    conference: { join: Function },
    dispatch: Dispatch<*>
};

/**
 * The style of the {@link TextInput} rendered by
 * {@code PasswordRequiredPrompt}. As it requests the entry of a password, the
 * entry should better be secure.
 */
const _TEXT_INPUT_PROPS = {
    secureTextEntry: true
};

/**
 * Implements a React {@code Component} which prompts the user when a password
 * is required to join a conference.
 */
class PasswordRequiredPrompt extends Component {
    /**
     * {@code PasswordRequiredPrompt}'s React {@code Component} prop types.
     *
     * @static
     */
    static propTypes = {
        conference: PropTypes.object,
        dispatch: PropTypes.func
    };

    /**
     * Initializes a new {@code PasswordRequiredPrompt} instance.
     *
     * @param {Props} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onCancel = this._onCancel.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Dialog
                bodyKey = 'dialog.passwordLabel'
                onCancel = { this._onCancel }
                onSubmit = { this._onSubmit }
                textInputProps = { _TEXT_INPUT_PROPS }
                titleKey = 'dialog.passwordRequired' />
        );
    }

    _onCancel: () => boolean;

    /**
     * Notifies this prompt that it has been dismissed by cancel.
     *
     * @private
     * @returns {boolean} If this prompt is to be closed/hidden, {@code true};
     * otherwise, {@code false}.
     */
    _onCancel() {
        // XXX The user has canceled this prompt for a password so we are to
        // attempt joining the conference without a password. If the conference
        // still requires a password to join, the user will be prompted again
        // later.
        return this._onSubmit(undefined);
    }

    _onSubmit: (?string) => boolean;

    /**
     * Notifies this prompt that it has been dismissed by submitting a specific
     * value.
     *
     * @param {string|undefined} value - The submitted value.
     * @private
     * @returns {boolean} If this prompt is to be closed/hidden, {@code true};
     * otherwise, {@code false}.
     */
    _onSubmit(value: ?string) {
        const { conference }: { conference: { join: Function } } = this.props;

        this.props.dispatch(setPassword(conference, conference.join, value));

        return true;
    }
}

export default connect()(PasswordRequiredPrompt);
