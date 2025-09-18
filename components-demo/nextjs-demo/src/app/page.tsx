import styles from './page.module.css';
import { Icon, InlineIcon } from '@iconify/react';

export default function Home() {
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1>Testing icons</h1>
				<p>
					Testing Icon: <Icon icon="mdi:home" />
				</p>
				<p>
					Testing InlineIcon:
					<InlineIcon
						icon="mdi:home-outline"
						style={{ color: '#c40' }}
					/>
					<InlineIcon icon="flat-color-icons:home" />
				</p>
			</main>
		</div>
	);
}
