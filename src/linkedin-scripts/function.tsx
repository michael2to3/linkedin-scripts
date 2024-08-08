import { showToast } from '@violentmonkey/ui';

class BaseFunctionality {
  humanReadName() {
    return 'Base Functionality';
  }
}

class CopyUsernames extends BaseFunctionality {
  humanReadName() {
    return 'Copy of usernames';
  }

  execute() {
    const usernames = document.querySelectorAll(
      'ul.reusable-search__entity-result-list.list-style-none li span[dir="ltr"]',
    );
    const text = Array.from(usernames)
      .map((el) => el.textContent)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied all usernames to clipboard', { type: 'success' });
    });
  }
}

class CopyLinksToProfile extends BaseFunctionality {
  humanReadName() {
    return 'Copy of profile links';
  }

  getLinksToProfile() {
    const profileLinks = document.querySelectorAll(
      'ul.reusable-search__entity-result-list.list-style-none li span.entity-result__title-text a',
    );
    return Array.from(profileLinks).map((el) => el.href);
  }

  execute() {
    const hrefs = this.getLinksToProfile().join('\n');
    navigator.clipboard.writeText(hrefs).then(() => {
      showToast('Copied all links profile to clipboard', { type: 'success' });
    });
  }
}

class CopyClearLinksToProfile extends CopyLinksToProfile {
  humanReadName() {
    return 'Copy of clear profile links';
  }

  execute() {
    const r = /\/([a-zA-Z0-9_-]*)\?/;
    const hrefs = this.getLinksToProfile()
      .map((el) => el.match(r))
      .filter(Boolean)
      .map((match) => match[1])
      .join('\n');
    navigator.clipboard.writeText(hrefs).then(() => {
      showToast('Copied all clear links profile to clipboard', {
        type: 'success',
      });
    });
  }
}

class UrlFunctionality {
  constructor() {
    this.urlMap = new Map();
  }

  addFunction(url, funcInstances) {
    this.urlMap.set(url, funcInstances);
  }

  getFunctionsForUrl(url) {
    for (const [key, value] of this.urlMap) {
      if (url.includes(key)) {
        return value;
      }
    }
    return [];
  }
}

const urlFunctionality = new UrlFunctionality();

urlFunctionality.addFunction('people', [
  new CopyUsernames(),
  new CopyLinksToProfile(),
  new CopyClearLinksToProfile(),
]);

export { urlFunctionality };
