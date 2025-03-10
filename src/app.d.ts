// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { DefaultSession } from '@auth/core/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: {
				user: {
					name: string;
					email: string;
					image: string;
					id: string;
				} | null;
			};
		}
		interface PageData {
			session: {
				user: {
					name: string;
					email: string;
					image: string;
					id: string;
				} | null;
			} | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@auth/core/types' {
	interface Session {
		user: {
			id: string;
		} & DefaultSession['user'];
	}
}

export {};
