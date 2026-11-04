import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { Skeleton } from "moti/skeleton";
import { ComponentProps, ReactNode } from "react";
import { Text, TextStyle, View } from "react-native";

const BASE = colors.darkSlateBlue;
const HIGHLIGHT = colors.charcoalSlate;
const SHIMMER = [BASE, HIGHLIGHT, BASE, HIGHLIGHT, BASE, HIGHLIGHT, BASE];

type BoneProps = ComponentProps<typeof Skeleton>;

export const SkeletonBone = (props: BoneProps) => (
	<Skeleton colors={SHIMMER} backgroundColor={BASE} {...props} />
);

export const SkeletonLine = ({
	font,
	width
}: {
	font: TextStyle;
	width: BoneProps["width"];
}) => (
	<View className="justify-center">
		<Text style={[font, { opacity: 0 }]}> </Text>
		<View className="absolute w-full">
			<SkeletonBone
				height={Math.round(Number(font.fontSize) * 0.7)}
				width={width}
				radius={4}
			/>
		</View>
	</View>
);

const LoadingGroup = ({
	label,
	className,
	children
}: {
	label: string;
	className?: string;
	children: ReactNode;
}) => (
	<View
		className={className}
		accessible
		accessibilityRole="progressbar"
		accessibilityLabel={label}
	>
		{children}
	</View>
);

const TEACHING_WIDTHS = [
	["72%", "46%", "34%"],
	["58%", "38%", "42%"],
	["84%", "52%", "30%"],
	["64%", "34%", "38%"],
	["76%", "44%", "32%"]
] as const;

export const TeachingListSkeleton = ({ count }: { count: number }) => (
	<LoadingGroup label="Loading teachings" className="gap-4">
		{Array.from({ length: count }, (_, i) => {
			const [title, passage, teacher] =
				TEACHING_WIDTHS[i % TEACHING_WIDTHS.length];
			return (
				<View
					key={i}
					className="p-4 flex-row gap-4 bg-charcoal-blue rounded-2xl border-dark-slate-blue border"
				>
					<SkeletonBone height={62} width={62} radius={16} />
					<View className="flex-1 justify-center gap-1 min-h-[62px]">
						<SkeletonLine font={fonts.subtitle1White} width={title} />
						<SkeletonLine font={fonts.caption1Grey} width={passage} />
						<SkeletonLine font={fonts.caption1Grey} width={teacher} />
					</View>
				</View>
			);
		})}
	</LoadingGroup>
);

const NOTIFICATION_WIDTHS = ["88%", "74%", "94%", "68%", "82%"] as const;

export const NotificationListSkeleton = ({ count }: { count: number }) => (
	<LoadingGroup label="Loading notifications">
		{Array.from({ length: count }, (_, i) => (
			<View key={i} className="mb-4">
				<SkeletonLine
					font={fonts.subtitle2White}
					width={NOTIFICATION_WIDTHS[i % NOTIFICATION_WIDTHS.length]}
				/>
				<SkeletonLine font={fonts.caption1Grey} width="32%" />
				<View
					style={{
						borderWidth: 0.5,
						borderColor: colors.darkGray,
						marginTop: 16
					}}
				/>
			</View>
		))}
	</LoadingGroup>
);

const EBOOK_WIDTHS = [
	{ title: "70%", author: "42%", tags: [52, 68, 44] },
	{ title: "56%", author: "34%", tags: [72, 48] },
	{ title: "82%", author: "48%", tags: [44, 60, 56] },
	{ title: "64%", author: "38%", tags: [60, 76] }
] as const;

export const EbookListSkeleton = ({ count }: { count: number }) => (
	<LoadingGroup label="Loading e-books" className="gap-3">
		{Array.from({ length: count }, (_, i) => {
			const { title, author, tags } = EBOOK_WIDTHS[i % EBOOK_WIDTHS.length];
			return (
				<View
					key={i}
					className="flex-row items-center bg-charcoal-blue rounded-2xl py-2 px-4 gap-4"
				>
					<SkeletonBone height={77} width={52} radius={3} />
					<View className="flex-1 flex-col gap-1">
						<SkeletonLine font={fonts.subtitle1White} width={title} />
						<SkeletonLine font={fonts.caption1Grey} width={author} />
						<View className="flex-row flex-wrap gap-2 mt-1">
							{tags.map((tagWidth, tagIndex) => (
								<SkeletonBone
									key={tagIndex}
									height={20}
									width={tagWidth}
									radius="round"
								/>
							))}
						</View>
					</View>
				</View>
			);
		})}
	</LoadingGroup>
);

const CLASS_SECTIONS = [
	{ heading: "34%", titles: ["68%", "52%"] },
	{ heading: "26%", titles: ["74%", "58%", "64%"] }
] as const;

export const ClassListSkeleton = () => (
	<LoadingGroup label="Loading classes" className="gap-3">
		{CLASS_SECTIONS.map(({ heading, titles }) => (
			<View key={heading}>
				<View className="mb-2">
					<SkeletonLine font={fonts.subtitle1White} width={heading} />
				</View>
				<View className="gap-3">
					{titles.map((title) => (
						<View
							key={title}
							className="flex-col gap-1 px-4 py-3 bg-charcoal-blue rounded-2xl"
						>
							<SkeletonLine font={fonts.subtitle1White} width={title} />
							<SkeletonLine font={fonts.caption1Grey} width="22%" />
						</View>
					))}
				</View>
			</View>
		))}
	</LoadingGroup>
);

export const ClassWeekListSkeleton = ({ count }: { count: number }) => (
	<LoadingGroup label="Loading class weeks" className="flex-1 flex-col gap-4">
		<SkeletonLine font={fonts.caption1Grey} width="28%" />
		<View>
			{Array.from({ length: count }, (_, i) => (
				<View
					key={i}
					className="flex-row justify-between items-center px-4 py-3 bg-charcoal-blue rounded-2xl mb-3"
				>
					<View className="flex-1">
						<SkeletonLine font={fonts.subtitle1White} width="24%" />
					</View>
					<Image
						source={require("@/assets/icons/chevron_right.svg")}
						style={{ width: 40, height: 40 }}
					/>
				</View>
			))}
		</View>
	</LoadingGroup>
);

const MATERIAL_WIDTHS = ["72%", "54%", "86%", "62%"] as const;

export const ClassMaterialListSkeleton = ({ count }: { count: number }) => (
	<LoadingGroup label="Loading class materials" className="gap-3">
		{Array.from({ length: count }, (_, i) => (
			<View
				key={i}
				className="flex-row items-center gap-4 px-5 py-4 bg-charcoal-blue rounded-3xl"
			>
				<SkeletonBone height={40} width={32} radius={6} />
				<View className="flex-1">
					<SkeletonLine
						font={fonts.subtitle1White}
						width={MATERIAL_WIDTHS[i % MATERIAL_WIDTHS.length]}
					/>
				</View>
			</View>
		))}
	</LoadingGroup>
);
