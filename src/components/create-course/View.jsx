import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flyout } from '@nti/web-commons';
import { Editor, Templates } from '@nti/web-course';
import { getService } from '@nti/web-client';
import { Models } from '@nti/lib-interfaces';
import {scoped} from '@nti/lib-locale';

import Option from './Option';

const t = scoped('library.components.CreateCourse', {
	new: 'New Course',
	import: 'Import a Course',
	importDescription: 'Use content from a previous course.'
});

export default class CreateCourse extends Component {
	static propTypes = {
		canCreate: PropTypes.bool.isRequired,
		store: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {}

	attachFlyoutRef = x => (this.flyout = x);

	async componentDidMount () {
		const service = await getService();
		const courseWorkspace = service.getWorkspace('Courses');
		const allCoursesCollection = courseWorkspace && service.getCollection('AllCourses', courseWorkspace.Title);

		if (allCoursesCollection && allCoursesCollection.accepts.includes(Models.courses.scorm.SCORMInstance.MimeType)) {
			this.setState({canCreateScorm: true});
		}
	}

	onCourseCreated = () => {
		this.props.store.reloadAdminFavorites();
	}

	onCourseModified = () => {
		this.props.store.reloadAdminFavorites();
	}

	launchCourseWizard = async template => {
		if (this.flyout) {
			this.flyout.dismiss();
		}

		const { router } = this.context;
		const newEntry = await Editor.createCourse(this.onCourseModified, template);

		if (newEntry) {
			router.routeTo.object(newEntry);
		}
	}

	renderCreateTrigger () {
		return (
			<div className="admin-create-button">
				<div className="add-container">
					<i className="icon-add" />
				</div>
				<div className="create-label">Create</div>
			</div>
		);
	}

	render () {
		if (!this.props.canCreate) {
			return null;
		}

		return (
			<Flyout.Triggered
				className="admin-create-options"
				trigger={this.renderCreateTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				ref={this.attachFlyoutRef}
			>
				<React.Fragment>
					<Option
						className="new-course"
						title={t('new')}
						description=""
						onClick={() => this.launchCourseWizard(Templates.Blank)}
					/>
					<Option
						className="import-course"
						title={t('import')}
						description={t('importDescription')}
						onClick={() => this.launchCourseWizard(Templates.Import)}
					/>
					{this.state.canCreateScorm && (
						<Option
							className="import-scorm-package"
							title="Import a SCORM Package"
							description="Use content from external services."
							onClick={() => this.launchCourseWizard(Templates.Scorm)}
						/>
					)}
				</React.Fragment>
			</Flyout.Triggered>
		);
	}
}
