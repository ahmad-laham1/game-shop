import React from "react";

export default function PageHeader({
  title,
  subtitle = "",
  actions = null,
  className = "",
  breadcrumbs = null,
  stats = null,
  variant = "default",
}) {
  return (
    <div className={`page-header page-header-${variant} ${className}`}>
      <div className="page-header-content">
        <div className="page-header-main">
          {breadcrumbs && (
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="breadcrumb-separator">/</span>}
                  <a href={crumb.href} className="breadcrumb-link">
                    {crumb.label}
                  </a>
                </React.Fragment>
              ))}
            </nav>
          )}

          <div className="page-header-text">
            <h1 className="page-header-title">{title}</h1>
            {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
          </div>

          {stats && (
            <div className="page-header-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
}
