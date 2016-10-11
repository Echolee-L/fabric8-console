/// <reference path="../../includes.ts"/>


/**
 * @module Wiki
 */
module Wiki {

  export var log:Logging.Logger = Logger.get("Wiki");

  export var camelNamespaces = ["http://camel.apache.org/schema/spring", "http://camel.apache.org/schema/blueprint"];
  export var springNamespaces = ["http://www.springframework.org/schema/beans"];
  export var droolsNamespaces = ["http://drools.org/schema/drools-spring"];
  export var dozerNamespaces = ["http://dozer.sourceforge.net"];
  export var activemqNamespaces = ["http://activemq.apache.org/schema/core"];

  export var useCamelCanvasByDefault = false;

  export var excludeAdjustmentPrefixes = ["http://", "https://", "#"];

  export enum ViewMode { List, Icon };

  /**
   * The custom views within the wiki namespace; either "/wiki/$foo" or "/wiki/branch/$branch/$foo"
   */
  export var customWikiViewPages = ["/formTable", "/camel/diagram", "/camel/canvas", "/camel/properties", "/dozer/mappings"];

  /**
   * Which extensions do we wish to hide in the wiki file listing
   * @property hideExtensions
   * @for Wiki
   * @type Array
   */
  export var hideExtensions = [".profile"];

  var defaultFileNamePattern = /^[a-zA-Z0-9._-]*$/;
  var defaultFileNamePatternInvalid = "Name must be: letters, numbers, and . _ or - characters";

  var defaultFileNameExtensionPattern = "";

  var defaultLowerCaseFileNamePattern = /^[a-z0-9._-]*$/;
  var defaultLowerCaseFileNamePatternInvalid = "Name must be: lower-case letters, numbers, and . _ or - characters";

  export interface GenerateOptions {
    workspace: any;
    form: any;
    name: string;
    branch: string;
    parentId: string;
    success: (fileContents?:string) => void;
    error: (error:any) => void;
  }

  /**
   * The wizard tree for creating new content in the wiki
   * @property documentTemplates
   * @for Wiki
   * @type Array
   */
  export var documentTemplates = [
    {
      label: "Folder",
      tooltip: "Create a new folder to contain documents",
      folder: true,
      icon: "/img/icons/wiki/folder.gif",
      exemplar: "myfolder",
      regex: defaultLowerCaseFileNamePattern,
      invalid: defaultLowerCaseFileNamePatternInvalid
    },
    {
      label: "Properties File",
      tooltip: "A properties file typically used to configure Java classes",
      exemplar: "properties-file.properties",
      regex: defaultFileNamePattern,
      invalid: defaultFileNamePatternInvalid,
      extension: ".properties"
    },
    {
      label: "JSON File",
      tooltip: "A file containing JSON data",
      exemplar: "document.json",
      regex: defaultFileNamePattern,
      invalid: defaultFileNamePatternInvalid,
      extension: ".json"
    },
    {
      label: "Markdown Document",
      tooltip: "A basic markup document using the Markdown wiki markup, particularly useful for ReadMe files in directories",
      exemplar: "ReadMe.md",
      regex: defaultFileNamePattern,
      invalid: defaultFileNamePatternInvalid,
      extension: ".md"
    },
    {
      label: "Text Document",
      tooltip: "A plain text file",
      exemplar: "document.text",
      regex: defaultFileNamePattern,
      invalid: defaultFileNamePatternInvalid,
      extension: ".txt"
    },
    {
      label: "HTML Document",
      tooltip: "A HTML document you can edit directly using the HTML markup",
      exemplar: "document.html",
      regex: defaultFileNamePattern,
      invalid: defaultFileNamePatternInvalid,
      extension: ".html"
    },
    {
      label: "XML Document",
      tooltip: "An empty XML document",
      exemplar: "document.xml",
      regex: defaultFileNamePattern,
      invalid: defaultFileNamePatternInvalid,
      extension: ".xml"
    },
    {
      label: "Integration Flows",
      tooltip: "Camel routes for defining your integration flows",
      children: [
        {
          label: "Camel XML document",
          tooltip: "A vanilla Camel XML document for integration flows",
          icon: "/img/icons/camel.svg",
          exemplar: "camel.xml",
          regex: defaultFileNamePattern,
          invalid: defaultFileNamePatternInvalid,
          extension: ".xml"
        },
        {
          label: "Camel OSGi Blueprint XML document",
          tooltip: "A vanilla Camel XML document for integration flows when using OSGi Blueprint",
          icon: "/img/icons/camel.svg",
          exemplar: "camel-blueprint.xml",
          regex: defaultFileNamePattern,
          invalid: defaultFileNamePatternInvalid,
          extension: ".xml"
        },
        {
          label: "Camel Spring XML document",
          tooltip: "A vanilla Camel XML document for integration flows when using the Spring framework",
          icon: "/img/icons/camel.svg",
          exemplar: "camel-spring.xml",
          regex: defaultFileNamePattern,
          invalid: defaultFileNamePatternInvalid,
          extension: ".xml"
        }
      ]
    },
    {
      label: "Source code",
      tooltip: "Create a source file",
      children: [
        // TODO this is better handled via forge
        {
          label: "Java",
          tooltip: "A Java language file",
          icon: "/img/icons/java.svg",
          exemplar: "document.java",
          regex: defaultFileNamePattern,
          invalid: defaultFileNamePatternInvalid,
          extension: ".java"
        },
        {
          label: "Go",
          tooltip: "A Go language file",
          icon: "/img/icons/gopher.png",
          exemplar: "document.go",
          regex: defaultFileNamePattern,
          invalid: defaultFileNamePatternInvalid,
          extension: ".go"
        },
        {
          label: "Python",
          tooltip: "A Python language file",
          icon: "/img/icons/python.png",
          exemplar: "document.py",
          regex: defaultFileNamePattern,
          invalid: defaultFileNamePatternInvalid,
          extension: ".py"
        },
        {
          label: "JavaScript",
          tooltip: "A JavaScript language file",
          icon: "/img/icons/javascript.png",
          exemplar: "document.js",
          regex: defaultFileNamePattern,
          invalid: defaultFileNamePatternInvalid,
          extension: ".js"
        },
        {
          label: "Ruby",
          tooltip: "A Ruby language file",
          icon: "/img/icons/ruby.png",
          exemplar: "document.rb",
          regex: defaultFileNamePattern,
          invalid: defaultFileNamePatternInvalid,
          extension: ".rb"
        },
        {
          label: "Swift",
          tooltip: "A Swift language file",
          icon: "/img/icons/swift.png",
          exemplar: "document.swift",
          regex: defaultFileNamePattern,
          invalid: defaultFileNamePatternInvalid,
          extension: ".swift"
        }
      ]
    },
    {
      label: "Data Mapping Document",
      tooltip: "Dozer based configuration of mapping documents",
      icon: "/img/icons/dozer/dozer.gif",
      exemplar: "dozer-mapping.xml",
      regex: defaultFileNamePattern,
      invalid: defaultFileNamePatternInvalid,
      extension: ".xml"
    }
  ];

  // TODO REMOVE
  export function isFMCContainer(workspace) {
    return false;
  }

  // TODO REMOVE
  export function isWikiEnabled(workspace, jolokia, localStorage) {
    return true;
  }

  export function goToLink(link, $timeout, $location) {
    var href = Core.trimLeading(link, "#");
    $timeout(() => {
      log.debug("About to navigate to: " + href);
      $location.url(href);
    }, 100);
  }

  /**
   * Returns all the links for the given branch for the custom views, starting with "/"
   * @param $scope
   * @returns {string[]}
   */
  export function customViewLinks($scope) {
    var prefix = Core.trimLeading(Wiki.startLink($scope), "#");
    return customWikiViewPages.map(path => prefix + path);
  }

  /**
   * Returns a new create document wizard tree
   * @method createWizardTree
   * @for Wiki
   * @static
   */
  export function createWizardTree(workspace, $scope) {
    var root = createFolder("New Documents");
    addCreateWizardFolders(workspace, $scope, root, documentTemplates);
    return root;
  }

  function createFolder(name): any {
    return {
      name: name,
      children: []
    };
  }

  export function addCreateWizardFolders(workspace, $scope, parent, templates: any[]) {
    angular.forEach(templates, (template) => {

      if ( template.generated ) {
        if ( template.generated.init ) {
          template.generated.init(workspace, $scope);
        }
      }

      var title = template.label || key;
      var node = createFolder(title);
      node.parent = parent;
      node.entity = template;

      var addClass = template.addClass;
      if (addClass) {
        node.addClass = addClass;
      }

      var key = template.exemplar;
      var parentKey = parent.key || "";
      node.key = parentKey ? parentKey + "_" + key : key;
      var icon = template.icon;
      if (icon) {
        node.icon = Core.url(icon);
      }
      // compiler was complaining about 'label' had no idea where it's coming from
      // var tooltip = value["tooltip"] || value["description"] || label;
      var tooltip = template["tooltip"] || template["description"] || '';
      node.tooltip = tooltip;
      if (template["folder"]) {
        node.isFolder = () => { return true; };
      }
      parent.children.push(node);

      var children = template.children;
      if (children) {
        addCreateWizardFolders(workspace, $scope, node, children);
      }
    });
  }

  export function startWikiLink(projectId, branch) {
    var start = UrlHelpers.join(Developer.projectLink(projectId), "/wiki");
    if (branch) {
      start = UrlHelpers.join(start, 'branch', branch);
    }
    return start;
  }

  export function startLink($scope) {
    var projectId = $scope.projectId;
    var branch = $scope.branch;
    return startWikiLink(projectId, branch);
  }

  /**
   * Returns true if the given filename/path is an index page (named index.* and is a markdown/html page).
   *
   * @param path
   * @returns {boolean}
   */
  export function isIndexPage(path: string) {
    return path && (_.endsWith(path, "index.md") || _.endsWith(path, "index.html") || _.endsWith(path, "index")) ? true : false;
  }

  export function viewLink(projectId:string, branch:string, pageId:string, $location, fileName:string = null) {
    var link:string = null;
    var start = startWikiLink(projectId, branch);
    if (pageId) {
      // figure out which view to use for this page
      var view = isIndexPage(pageId) ? "/book/" : "/view/";
      link = start + view + encodePath(Core.trimLeading(pageId, "/"));
    } else {
      // lets use the current path
      var path:string = $location.path();
      link = "#" + path.replace(/(edit|create)/, "view");
    }
    if (fileName && pageId && _.endsWith(pageId, fileName)) {
      return link;
    }
    if (fileName) {
      if (!_.endsWith(link, "/")) {
        link += "/";
      }
      link += fileName;
    }
    return link;
  }

  export function branchLink(projectId:string, branch:string, pageId: string, $location, fileName:string = null) {
    return viewLink(projectId, branch, pageId, $location, fileName);
  }

  export function editLink($scope, pageId:string, $location) {
    var link:string = null;
    var format = Wiki.fileFormat(pageId);
    switch (format) {
      case "image":
        break;
      default:
      var start = startLink($scope);
      if (pageId) {
        link = start + "/edit/" + encodePath(pageId);
      } else {
        // lets use the current path
        var path = $location.path();
        link = "#" + path.replace(/(view|create)/, "edit");
      }
    }
    return link;
  }

  export function customEditLink($scope, pageId:string, $location, editView = "edit") {
    var link:string = null;
    var format = Wiki.fileFormat(pageId);
    switch (format) {
      case "image":
        break;
      default:
      var start = startLink($scope);
      if (pageId) {
        link = UrlHelpers.join(start, editView, encodePath(pageId));
      } else {
        // lets use the current path
        var path = $location.path();
        link = "#" + path.replace(/(view|create)/, editView);
      }
    }
    return link;
  }

  export function createLink($scope, pageId:string, $location) {
    var path = $location.path();
    var start = startLink($scope);
    var link = '';
    if (pageId) {
      link = start + "/create/" + encodePath(pageId);
    } else {
      // lets use the current path
      link = "#" + path.replace(/(view|edit|formTable)/, "create");
    }
    // we have the link so lets now remove the last path
    // or if there is no / in the path then remove the last section
    var idx = link.lastIndexOf("/");
    if (idx > 0 && !$scope.children && !path.startsWith("/wiki/formTable")) {
      link = link.substring(0, idx + 1);
    }
    return link;
  }

  export function encodePath(pageId:string) {
    return pageId.split("/").map(encodeURIComponent).join("/");
  }

  export function decodePath(pageId:string) {
    return pageId.split("/").map(decodeURIComponent).join("/");
  }

  export function fileFormat(name:string, fileExtensionTypeRegistry?) {
    var extension = fileExtension(name);
    if (name) {
      if (name === "Jenkinsfile") {
        extension = "groovy";
      }
    }
    var answer = null;
    if (!fileExtensionTypeRegistry) {
      fileExtensionTypeRegistry = HawtioCore.injector.get("fileExtensionTypeRegistry");
    }
    angular.forEach(fileExtensionTypeRegistry, (array, key) => {
      if (array.indexOf(extension) >= 0) {
        answer = key;
      }
    });
    return answer;
  }

  /**
   * Returns the file name of the given path; stripping off any directories
   * @method fileName
   * @for Wiki
   * @static
   * @param {String} path
   * @return {String}
   */
  export function fileName(path: string) {
    if (path) {
       var idx = path.lastIndexOf("/");
      if (idx > 0) {
        return path.substring(idx + 1);
      }
    }
    return path;
  }

  /**
   * Returns the folder of the given path (everything but the last path name)
   * @method fileParent
   * @for Wiki
   * @static
   * @param {String} path
   * @return {String}
   */
  export function fileParent(path: string) {
    if (path) {
       var idx = path.lastIndexOf("/");
      if (idx > 0) {
        return path.substring(0, idx);
      }
    }
    // lets return the root directory
    return "";
  }

  /**
   * Returns the file name for the given name; we hide some extensions
   * @method hideFineNameExtensions
   * @for Wiki
   * @static
   * @param {String} name
   * @return {String}
   */
  export function hideFileNameExtensions(name) {
    if (name) {
      angular.forEach(Wiki.hideExtensions, (extension) => {
        if (name.endsWith(extension)) {
          name = name.substring(0, name.length - extension.length);
        }
      });
    }
    return name;
  }

  /**
   * Returns the URL to perform a GET or POST for the given branch name and path
   */
  export function gitRestURL($scope, path: string, branch?: string):string {
    return Forge.createHttpUrl($scope.projectId,
      new URI(Kubernetes.inject<string>("ForgeApiURL"))
        .segment('repos/project')
        .segment($scope.namespace || Kubernetes.currentKubernetesNamespace())
        .segment($scope.projectId)
        .segment('raw')
        .segment(path)
        .toString()) + '?branch=' + (branch || $scope.branch || 'master');
  }

  /**
   * Takes a row containing the entity object; or can take the entity directly.
   *
   * It then uses the name, directory and xmlNamespaces properties
   *
   * @method fileIconHtml
   * @for Wiki
   * @static
   * @param {any} row
   * @return {String}
   *
   */
  export function fileIconHtml(row, $scope) {
    var name = row.name;
    var path = row.path;
    var branch = row.branch;
    var directory = row.directory;
    var xmlNamespaces = row.xml_namespaces || row.xmlNamespaces;
    var iconUrl = row.iconUrl;
    var entity = row.entity;
    if (entity) {
      name = name || entity.name;
      path = path || entity.path;
      branch = branch || entity.branch;
      directory = directory || entity.directory;
      xmlNamespaces = xmlNamespaces || entity.xml_namespaces || entity.xmlNamespaces;
      iconUrl = iconUrl || entity.iconUrl;
    }
    branch = branch || "master";
    var css = null;
    var icon:string = null;
    let git = false;
    var extension = fileExtension(name);
    // TODO could we use different icons for markdown v xml v html
    if (xmlNamespaces && xmlNamespaces.length) {
      if (_.some(xmlNamespaces, (ns) => _.some(Wiki.camelNamespaces, ns))) {
        icon = "img/icons/camel.svg";
      } else if (_.some(xmlNamespaces, (ns) => _.some(Wiki.dozerNamespaces, ns))) {
        icon = "img/icons/dozer/dozer.gif";
      } else if (_.some(xmlNamespaces, (ns) => _.some(Wiki.activemqNamespaces, ns))) {
        icon = "img/icons/messagebroker.svg";
      } else {
        log.debug("file " + name + " has namespaces " + xmlNamespaces);
      }
    }
    if (!iconUrl && name) {
      var lowerName = name.toLowerCase();
      if (lowerName == "pom.xml") {
        iconUrl = "img/maven-icon.png";
      } else if (lowerName == "web.config") {
        iconUrl = "img/icons/dotnet.png";
      } else if (lowerName == "jenkinsfile") {
        iconUrl = "img/jenkins-icon.svg";
      } else if (lowerName == "fabric8.yml") {
        iconUrl = "img/fabric8_icon.svg";
      } else if (lowerName == "funktion.yml") {
        iconUrl = "img/icons/funktion.png";
      }
    }

    if (iconUrl) {
      css = null;
      icon = iconUrl;
/*
      var prefix = gitUrlPrefix();
      icon = UrlHelpers.join(prefix, "git", iconUrl);
*/
/*
      var connectionName = Core.getConnectionNameParameter();
      if (connectionName) {
        var connectionOptions = Core.getConnectOptions(connectionName);
        if (connectionOptions) {
          connectionOptions.path = Core.url('/' + icon);
          icon = <string>Core.createServerConnectionUrl(connectionOptions);
        }
      }
*/
    }
    if (!icon) {
      if (directory) {
        switch (extension) {
          case 'profile':
            css = "fa fa-book";
            break;
          default:
            // log.debug("No match for extension: ", extension, " using a generic folder icon");
            css = "fa fa-folder folder-icon";
        }
      } else {
        switch (extension) {
          case 'cs':
            icon = "img/icons/csharp.png";
          case 'java':
            icon = "img/java.svg";
            break;
          case 'go':
            icon = "img/icons/gopher.png";
            break;
          case 'groovy':
            icon = "img/icons/groovy.svg";
            break;
          case 'js':
            icon = "img/icons/javascript.png";
            break;
          case 'php':
            icon = "img/icons/php.png";
            break;
          case 'py':
            icon = "img/icons/python.png";
            break;
          case 'rb':
            icon = "img/icons/ruby.png";
            break;
          case 'swift':
            icon = "img/icons/swift.png";
            break;
          case 'png':
          case 'svg':
          case 'jpg':
          case 'gif':
            css = null;
            git = true;
            icon = Wiki.gitRestURL($scope, path, branch);
/*
            var connectionName = Core.getConnectionNameParameter();
            if (connectionName) {
              var connectionOptions = Core.getConnectOptions(connectionName);
              if (connectionOptions) {
                connectionOptions.path = Core.url('/' + icon);
                icon = <string>Core.createServerConnectionUrl(connectionOptions);
              }
            }
*/
            break;
          case 'json':
          case 'xml':
            css = "fa fa-file-text";
            break;
          case 'md':
            css = "fa fa-file-text-o";
            break;
          default:
            // log.debug("No match for extension: ", extension, " using a generic file icon");
            css = "fa fa-file-o";
        }
      }
    }
    if (icon) {
      if (git) {
        return '<img http-src="' + icon + '"' + (extension === 'svg' ? ' media-type="image/svg+xml"' : '') + ' http-src-changed="child.downloadURL" />';
      } else {
        return '<img src="' + Core.url(icon) + '">';
      }
    } else {
      return '<i class="' + css + '"></i>';
    }
  }

  export function iconClass(row) {
    var name = row.getProperty("name");
    var extension = fileExtension(name);
    var directory = row.getProperty("directory");
    if (directory) {
      return "fa fa-folder";
    }
    if ("xml" === extension) {
        return "fa fa-cog";
    } else if ("md" === extension) {
        return "fa fa-file-text-o";
    }
    // TODO could we use different icons for markdown v xml v html
    return "fa fa-file-o";
  }


  /**
   * Extracts the pageId, branch, objectId from the route parameters
   * @method initScope
   * @for Wiki
   * @static
   * @param {*} $scope
   * @param {any} $routeParams
   * @param {ng.ILocationService} $location
   */
  export function initScope($scope, $routeParams, $location) {
    $scope.pageId = Wiki.pageId($routeParams, $location);

    // lets let these to be inherited if we include a template on another page
    $scope.projectId = $routeParams["projectId"] || $scope.id;
    $scope.namespace = $routeParams["namespace"] || $scope.namespace;
    Kubernetes.setCurrentKubernetesNamespace($scope.namespace);

    $scope.owner = $routeParams["owner"];
    $scope.repoId = $routeParams["repoId"];
    $scope.branch = $routeParams["branch"] || $location.search()["branch"];
    $scope.objectId = $routeParams["objectId"] || $routeParams["diffObjectId1"];
    $scope.startLink = startLink($scope);
    $scope.$viewLink = viewLink($scope.projectId, $scope.branch, $scope.pageId, $location);
    $scope.historyLink = startLink($scope) + "/history/" + ($scope.pageId || "");
    $scope.wikiRepository = new GitWikiRepository($scope);
    $scope.$workspaceLink = Developer.workspaceLink();
    $scope.$projectLink = Developer.projectLink($scope.projectId);
    $scope.breadcrumbConfig = Developer.createProjectBreadcrumbs($scope.projectId, createSourceBreadcrumbs($scope));
    $scope.subTabConfig = Developer.createProjectSubNavBars($scope.projectId);

    Forge.updateForgeProject($scope);

    Forge.redirectToSetupSecretsIfNotDefined($scope, $location);
  }

  /**
   * Loads the branches for this wiki repository and stores them in the branches property in
   * the $scope and ensures $scope.branch is set to a valid value
   *
   * @param wikiRepository
   * @param $scope
   * @param isFmc whether we run as fabric8 or as hawtio
   */
  export function loadBranches(jolokia, wikiRepository, $scope, isFmc = false) {
    wikiRepository.branches((response) => {
      // lets sort by version number
      $scope.branches = _.sortBy(response, (v:any) => Core.versionToSortableString(v), true);

      // default the branch name if we have 'master'
      if (!$scope.branch && _.find($scope.branches, (branch) => {
        return branch === "master";
      })) {
        $scope.branch = "master";
      }
      Core.$apply($scope);
    });
  }

  /**
   * Extracts the pageId from the route parameters
   * @method pageId
   * @for Wiki
   * @static
   * @param {any} $routeParams
   * @param @ng.ILocationService @location
   * @return {String}
   */
  export function pageId($routeParams, $location) {
    var pageId = $routeParams['page'];
    if (!pageId) {
      // Lets deal with the hack of AngularJS not supporting / in a path variable
      for (var i = 0; i < 100; i++) {
        var value = $routeParams['path' + i];
        if (angular.isDefined(value)) {
          if (!pageId) {
            pageId = value;
          } else {
            pageId += "/" + value;
          }
        } else break;
      }
      return pageId || "/";
    }

    // if no $routeParams variables lets figure it out from the $location
    if (!pageId) {
      pageId = pageIdFromURI($location.path());
    }
    return pageId;
  }

  export function pageIdFromURI(url:string) {
    var wikiPrefix = "/wiki/";
    if (url && _.startsWith(url, wikiPrefix)) {
      var idx = url.indexOf("/", wikiPrefix.length + 1);
      if (idx > 0) {
        return url.substring(idx + 1, url.length)
      }
    }
    return null

  }

  export function fileExtension(name) {
    if (name.indexOf('#') > 0)
      name = name.substring(0, name.indexOf('#'));
    return Core.fileExtension(name, "markdown");
  }


  export function onComplete(status) {
    console.log("Completed operation with status: " + JSON.stringify(status));
  }

  /**
   * Parses the given JSON text reporting to the user if there is a parse error
   * @method parseJson
   * @for Wiki
   * @static
   * @param {String} text
   * @return {any}
   */
  export function parseJson(text:string) {
    if (text) {
      try {
        return JSON.parse(text);
      } catch (e) {
        Core.notification("error", "Failed to parse JSON: " + e);
      }
    }
    return null;
  }

  /**
   * Adjusts a relative or absolute link from a wiki or file system to one using the hash bang syntax
   * @method adjustHref
   * @for Wiki
   * @static
   * @param {*} $scope
   * @param {ng.ILocationService} $location
   * @param {String} href
   * @param {String} fileExtension
   * @return {string}
   */
  export function adjustHref($scope, $location, href, fileExtension) {
    var extension = fileExtension ? "." + fileExtension : "";

    // if the last part of the path has a dot in it lets
    // exclude it as we are relative to a markdown or html file in a folder
    // such as when viewing readme.md or index.md
    var path = $location.path();
    var folderPath = path;
    var idx = path.lastIndexOf("/");
    if (idx > 0) {
      var lastName = path.substring(idx + 1);
      if (lastName.indexOf(".") >= 0) {
        folderPath = path.substring(0, idx);
      }
    }

    // Deal with relative URLs first...
    if (href.startsWith('../')) {
      var parts = href.split('/');
      var pathParts = folderPath.split('/');
      var parents = parts.filter((part) => {
        return part === "..";
      });
      parts = parts.last(parts.length - parents.length);
      pathParts = pathParts.first(pathParts.length - parents.length);

      return '#' + pathParts.join('/') + '/' + parts.join('/') + extension + $location.hash();
    }

    // Turn an absolute link into a wiki link...
    if (href.startsWith('/')) {
      return Wiki.branchLink($scope.projectId, $scope.branch, href + extension, $location) + extension;
    }

    if (!_.some(Wiki.excludeAdjustmentPrefixes, (exclude) => {
      return href.startsWith(exclude);
    })) {
      return '#' + folderPath + "/" + href + extension + $location.hash();
    } else {
      return null;
    }
  }
}
