import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./css/AdminControllerContainer.module.css";

const AdminControllerContainer = ({ roles, currentData, onOpenForm }) => {
  const { t } = useTranslation("advanceLearning");
  const userHasAccess = roles.includes("teacher") || roles.includes("admin");

  return (
    userHasAccess && (
      <div className={styles.controls}>
        <button
          onClick={() => onOpenForm({ type: "add" })}
          className={styles.controlButton}
        >
          {t("advancedLearning.admin.add")}
        </button>
        <button
          onClick={() => onOpenForm({ type: "update", data: currentData })}
          className={styles.controlButton}
          disabled={!currentData}
        >
          {t("advancedLearning.admin.update")}
        </button>
        <button
          onClick={() => onOpenForm({ type: "delete", data: currentData })}
          className={styles.deleteButton} // Use new style for the delete button
          disabled={!currentData}
        >
          {t("advancedLearning.admin.delete")}
        </button>
      </div>
    )
  );
};

export default AdminControllerContainer;
