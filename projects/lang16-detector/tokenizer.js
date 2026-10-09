/**
 * WordPiece tokenizer replicating HuggingFace BertTokenizer behavior.
 * Matches the Python tokenizer used in model/query.py:
 *   - do_lower_case = false
 *   - tokenize_chinese_chars = true
 *   - max_length = 15, padding = "max_length", truncation = true
 */
class WordPieceTokenizer {
  constructor(vocab) {
    // vocab: Map from token string -> id
    this.vocab = vocab;
    this.unkToken = "[UNK]";
    this.clsToken = "[CLS]";
    this.sepToken = "[SEP]";
    this.padToken = "[PAD]";
    this.unkId = vocab.get(this.unkToken);
    this.clsId = vocab.get(this.clsToken);
    this.sepId = vocab.get(this.sepToken);
    this.padId = vocab.get(this.padToken);
    this.maxInputCharsPerWord = 100;
  }

  // ---------- Basic tokenizer helpers ----------

  isWhitespace(char) {
    if (char === " " || char === "\t" || char === "\n" || char === "\r") {
      return true;
    }
    // Unicode category Zs (space separators)
    return /\p{Zs}/u.test(char);
  }

  isControl(char) {
    if (char === "\t" || char === "\n" || char === "\r") {
      return false;
    }
    // Unicode category C* (control, format, etc.)
    return /\p{C}/u.test(char);
  }

  isPunctuation(char) {
    const cp = char.codePointAt(0);
    if (
      (cp >= 33 && cp <= 47) ||
      (cp >= 58 && cp <= 64) ||
      (cp >= 91 && cp <= 96) ||
      (cp >= 123 && cp <= 126)
    ) {
      return true;
    }
    // Unicode category P* (punctuation)
    return /\p{P}/u.test(char);
  }

  isChineseChar(cp) {
    return (
      (cp >= 0x4e00 && cp <= 0x9fff) ||
      (cp >= 0x3400 && cp <= 0x4dbf) ||
      (cp >= 0x20000 && cp <= 0x2a6df) ||
      (cp >= 0x2a700 && cp <= 0x2b73f) ||
      (cp >= 0x2b740 && cp <= 0x2b81f) ||
      (cp >= 0x2b820 && cp <= 0x2ceaf) ||
      (cp >= 0xf900 && cp <= 0xfaff) ||
      (cp >= 0x2f800 && cp <= 0x2fa1f)
    );
  }

  cleanText(text) {
    let output = "";
    for (const char of text) {
      const cp = char.codePointAt(0);
      if (cp === 0 || cp === 0xfffd || this.isControl(char)) {
        continue;
      }
      if (this.isWhitespace(char)) {
        output += " ";
      } else {
        output += char;
      }
    }
    return output;
  }

  tokenizeChineseChars(text) {
    let output = "";
    for (const char of text) {
      const cp = char.codePointAt(0);
      if (this.isChineseChar(cp)) {
        output += " " + char + " ";
      } else {
        output += char;
      }
    }
    return output;
  }

  splitOnPunctuation(text) {
    const chars = Array.from(text);
    const output = [];
    let i = 0;
    let startNewWord = true;
    while (i < chars.length) {
      const char = chars[i];
      if (this.isPunctuation(char)) {
        output.push([char]);
        startNewWord = true;
      } else {
        if (startNewWord) {
          output.push([]);
        }
        startNewWord = false;
        output[output.length - 1].push(char);
      }
      i++;
    }
    return output.map((x) => x.join(""));
  }

  basicTokenize(text) {
    text = this.cleanText(text);
    text = this.tokenizeChineseChars(text);
    const origTokens = text.split(/\s+/).filter((t) => t.length > 0);
    const splitTokens = [];
    for (const token of origTokens) {
      splitTokens.push(...this.splitOnPunctuation(token));
    }
    return splitTokens.filter((t) => t.length > 0);
  }

  // ---------- WordPiece ----------

  wordpieceTokenize(token) {
    const chars = Array.from(token);
    if (chars.length > this.maxInputCharsPerWord) {
      return [this.unkToken];
    }
    const subTokens = [];
    let start = 0;
    let isBad = false;
    while (start < chars.length) {
      let end = chars.length;
      let curSubstr = null;
      while (start < end) {
        let substr = chars.slice(start, end).join("");
        if (start > 0) {
          substr = "##" + substr;
        }
        if (this.vocab.has(substr)) {
          curSubstr = substr;
          break;
        }
        end--;
      }
      if (curSubstr === null) {
        isBad = true;
        break;
      }
      subTokens.push(curSubstr);
      start = end;
    }
    if (isBad) {
      return [this.unkToken];
    }
    return subTokens;
  }

  tokenize(text) {
    const splitTokens = [];
    for (const token of this.basicTokenize(text)) {
      splitTokens.push(...this.wordpieceTokenize(token));
    }
    return splitTokens;
  }

  /**
   * Encode text to input IDs matching query.py:
   *   [CLS] + tokens + [SEP], truncated to maxLength, padded with [PAD].
   */
  encode(text, maxLength = 15) {
    const tokens = this.tokenize(text);
    const maxContent = maxLength - 2;
    const truncated = tokens.slice(0, maxContent);
    const ids = [
      this.clsId,
      ...truncated.map((t) => this.vocab.get(t) ?? this.unkId),
      this.sepId,
    ];
    while (ids.length < maxLength) {
      ids.push(this.padId);
    }
    return ids;
  }
}