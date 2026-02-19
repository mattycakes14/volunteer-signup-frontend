import styles from "@/components/dashboard/MetricContainer.module.css";
import Image, { StaticImageData } from "next/image";

interface MetricContainerProps {
  title: string;
  image: StaticImageData;
  metric: number;
}

const MetricContainer = ({ title, image, metric }: MetricContainerProps) => {
  return (
    <div className={styles.metricContainer}>
      <div className={styles.title}>{title}</div>
      <div className={styles.metric}>{metric}</div>
      <Image className={styles.icon} src={image} alt={title} />
    </div>
  );
};

export default MetricContainer;
