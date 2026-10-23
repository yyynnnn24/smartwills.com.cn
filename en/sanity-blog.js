(function () {
  "use strict";

  var config = {
    projectId: "t8zq96cd",
    dataset: "production",
    apiVersion: "2026-08-03",
    pageSize: 6
  };

  var apiUrl =
    "https://" +
    config.projectId +
    ".api.sanity.io/" +
    "v" +
    config.apiVersion +
    "/data/query/" +
    config.dataset;

  function fetchQuery(query, params) {
    var searchParams = new URLSearchParams({ query: query, perspective: "published" });
    Object.keys(params || {}).forEach(function (key) {
      searchParams.set("$" + key, JSON.stringify(params[key]));
    });

    return fetch(apiUrl + "?" + searchParams.toString())
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Sanity request failed");
        }
        return response.json();
      })
      .then(function (payload) {
        return payload.result;
      });
  }

  function formatDate(value) {
    if (!value) {
      return "";
    }

    return new Intl.DateTimeFormat("en-MY", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(value));
  }

  function articleUrl(slug) {
    return "BlogArticle.html?slug=" + encodeURIComponent(slug);
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    return element;
  }

  function createCard(post) {
    var card = createElement("article", "blog-card");
    var href = articleUrl(post.slug);
    var imageLink = createElement("a", "blog-card__image-link");
    imageLink.href = href;
    imageLink.setAttribute("aria-label", "Read " + post.title);

    if (post.imageUrl) {
      var image = document.createElement("img");
      image.src = post.imageUrl;
      image.alt = post.imageAlt || post.title;
      image.loading = "lazy";
      imageLink.appendChild(image);
    }

    var meta = createElement("div", "blog-card__meta");
    meta.appendChild(createElement("span", "", post.category || "SmartWills"));
    meta.appendChild(createElement("span", "", "•"));
    var time = createElement("time", "", formatDate(post.publishedAt));
    time.dateTime = post.publishedAt || "";
    meta.appendChild(time);

    var heading = createElement("h2");
    var titleLink = createElement("a", "", post.title);
    titleLink.href = href;
    heading.appendChild(titleLink);

    card.appendChild(imageLink);
    card.appendChild(meta);
    card.appendChild(heading);
    return card;
  }

  function renderPagedCards(grid, posts, button) {
    var showing = config.pageSize;
    grid.replaceChildren.apply(grid, posts.slice(0, showing).map(createCard));

    function updateButton() {
      if (button instanceof HTMLButtonElement) {
        button.hidden = showing >= posts.length;
      }
    }

    updateButton();
    if (button instanceof HTMLButtonElement) {
      button.onclick = function () {
        var nextPosts = posts.slice(showing, showing + config.pageSize);
        nextPosts.forEach(function (post) {
          grid.appendChild(createCard(post));
        });
        showing += nextPosts.length;
        updateButton();
      };
    }
  }

  function renderSpanChildren(target, children, markDefs) {
    (children || []).forEach(function (child) {
      var node = document.createTextNode(child.text || "");
      var marks = child.marks || [];
      if (marks.indexOf("strong") !== -1) {
        var strong = document.createElement("strong");
        strong.appendChild(node);
        node = strong;
      }
      if (marks.indexOf("em") !== -1) {
        var emphasis = document.createElement("em");
        emphasis.appendChild(node);
        node = emphasis;
      }
      if (marks.indexOf("underline") !== -1) {
        var underline = document.createElement("u");
        underline.appendChild(node);
        node = underline;
      }

      (markDefs || []).forEach(function (definition) {
        if (marks.indexOf(definition._key) !== -1 && definition._type === "link" && definition.href) {
          var link = document.createElement("a");
          link.href = definition.href;
          link.rel = "noopener noreferrer";
          link.appendChild(node);
          node = link;
        }
      });
      target.appendChild(node);
    });
  }

  function renderTable(tableBlock) {
    var wrapper = createElement("div", "blog-article__table-wrap");
    var table = createElement("table", "blog-article__table");
    var headerRows = Math.max(0, Number(tableBlock.headerRows) || 0);

    (tableBlock.rows || []).forEach(function (row, rowIndex) {
      var tableRow = document.createElement("tr");
      var cellTag = rowIndex < headerRows ? "th" : "td";

      (row.cells || []).forEach(function (cell) {
        var tableCell = document.createElement(cellTag);
        (cell.value || []).forEach(function (block) {
          if (block._type !== "block") return;

          var tagName = block.style === "h2" || block.style === "h3" ? block.style : "p";
          var element = document.createElement(tagName);
          renderSpanChildren(element, block.children, block.markDefs);
          tableCell.appendChild(element);
        });
        tableRow.appendChild(tableCell);
      });
      table.appendChild(tableRow);
    });

    wrapper.appendChild(table);
    return wrapper;
  }

  function renderArticleImage(imageBlock) {
    if (!imageBlock.imageUrl) {
      return null;
    }

    var figure = createElement("figure", "blog-article__inline-image");
    var image = document.createElement("img");
    image.src = imageBlock.imageUrl;
    image.alt = imageBlock.alt || "";
    image.loading = "lazy";
    figure.appendChild(image);

    if (imageBlock.caption) {
      figure.appendChild(createElement("figcaption", "", imageBlock.caption));
    }

    return figure;
  }

  function renderBody(container, blocks) {
    var list = null;
    container.replaceChildren();

    (blocks || []).forEach(function (block) {
      if (block._type === "table") {
        list = null;
        container.appendChild(renderTable(block));
        return;
      }
      if (block._type === "articleImage") {
        var figure = renderArticleImage(block);
        list = null;
        if (figure) container.appendChild(figure);
        return;
      }
      if (block._type !== "block") {
        return;
      }

      var tagName = block.style === "h2" || block.style === "h3" ? block.style : "p";
      if (block.style === "blockquote") {
        tagName = "blockquote";
      }

      if (block.listItem) {
        var listTag = block.listItem === "number" ? "ol" : "ul";
        if (!list || list.tagName.toLowerCase() !== listTag || block.level !== list.level) {
          list = document.createElement(listTag);
          list.level = block.level;
          container.appendChild(list);
        }
        var listItem = document.createElement("li");
        renderSpanChildren(listItem, block.children, block.markDefs);
        list.appendChild(listItem);
        return;
      }

      list = null;
      var element = document.createElement(tagName);
      renderSpanChildren(element, block.children, block.markDefs);
      container.appendChild(element);
    });
  }

  function setOrCreateMeta(selector, attributeName, attributeValue, content) {
    if (!content) return;

    var meta = document.querySelector(selector);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attributeName, attributeValue);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  function setOrCreateCanonical(url) {
    if (!url) return;

    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  function setArticleMetadata(post) {
    var metaTitle = (post.seoTitle || post.title) + " | SmartWills Malaysia";
    var metaDescription = post.seoDescription || post.excerpt;
    var canonicalUrl = "https://smartwills.com.my/" + articleUrl(post.slug);
    var imageUrl = post.imageUrl || "https://smartwills.com.my/Asset/Home_Images/Will_bg.jpg";

    document.title = metaTitle;
    setOrCreateCanonical(canonicalUrl);
    setOrCreateMeta('meta[name="description"]', "name", "description", metaDescription);
    setOrCreateMeta('meta[property="og:site_name"]', "property", "og:site_name", "SmartWills Malaysia");
    setOrCreateMeta('meta[property="og:type"]', "property", "og:type", "article");
    setOrCreateMeta('meta[property="og:title"]', "property", "og:title", metaTitle);
    setOrCreateMeta('meta[property="og:description"]', "property", "og:description", metaDescription);
    setOrCreateMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setOrCreateMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
    setOrCreateMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setOrCreateMeta('meta[name="twitter:title"]', "name", "twitter:title", metaTitle);
    setOrCreateMeta('meta[name="twitter:description"]', "name", "twitter:description", metaDescription);
    setOrCreateMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);
  }

  function initListing() {
    var grid = document.querySelector("[data-blog-grid]");
    if (!grid) {
      return;
    }

    var query = '*[_type == "blogPost" && (language == "en" || !defined(language)) && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc){_id, title, "slug": slug.current, category, publishedAt, excerpt, "imageUrl": mainImage.asset->url, "imageAlt": mainImage.alt}';
    fetchQuery(query)
      .then(function (posts) {
        if (Array.isArray(posts)) {
          renderPagedCards(grid, posts, document.querySelector("[data-blog-load-more]"));
        }
      })
      .catch(function () {
        // Keep the empty list when the public content API is unavailable.
      });
  }

  function initArticle() {
    var slug = new URLSearchParams(window.location.search).get("slug");
    if (!slug) {
      return;
    }

    var article = document.querySelector(".blog-article");
    var readMore = document.querySelector(".article-read-more");
    var query = '*[_type == "blogPost" && (language == "en" || !defined(language)) && slug.current == $slug][0]{title, "slug": slug.current, category, publishedAt, excerpt, seoTitle, seoDescription, body[]{..., _type == "articleImage" => {..., "imageUrl": image.asset->url}}, "imageUrl": mainImage.asset->url, "imageAlt": mainImage.alt}';
    fetchQuery(query, { slug: slug })
      .then(function (post) {
        if (!post) {
          return;
        }

        var category = document.querySelector(".blog-article__category");
        var title = document.querySelector(".blog-article__header h1");
        var time = document.querySelector(".blog-article__header time");
        var hero = document.querySelector(".blog-article__hero img");
        var content = document.querySelector(".blog-article__content");

        if (category) category.textContent = post.category || "SmartWills";
        if (title) title.textContent = post.title;
        if (time) {
          time.textContent = formatDate(post.publishedAt);
          time.dateTime = post.publishedAt || "";
        }
        if (hero && post.imageUrl) {
          hero.src = post.imageUrl;
          hero.alt = post.imageAlt || post.title;
        }
        if (content && Array.isArray(post.body) && post.body.length > 0) {
          renderBody(content, post.body);
        }
        setArticleMetadata(post);
        if (article) article.hidden = false;

        var readMoreGrid = document.querySelector(".article-read-more__grid");
        if (readMoreGrid) {
          var relatedQuery = '*[_type == "blogPost" && (language == "en" || !defined(language)) && defined(slug.current) && slug.current != $slug && defined(publishedAt)] | order(publishedAt desc)[0...2]{_id, title, "slug": slug.current, category, publishedAt, "imageUrl": mainImage.asset->url, "imageAlt": mainImage.alt}';
          fetchQuery(relatedQuery, { slug: post.slug }).then(function (posts) {
            if (Array.isArray(posts) && posts.length > 0) {
              readMoreGrid.replaceChildren.apply(readMoreGrid, posts.map(createCard));
              if (readMore) readMore.hidden = false;
            }
          });
        }
      })
      .catch(function () {
        // Keep the article hidden when the requested post cannot be loaded.
      });
  }

  initListing();
  initArticle();
})();
