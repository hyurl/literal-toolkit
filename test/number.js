const assert = require("assert");
const number = require("..").number;

describe("Testing numbers from strings", () => {
    it("should check binary numbers as expected", () => {
        assert.strictEqual(number.isBin("0b1010101"), true);
        assert.strictEqual(number.isBin("0B1010101"), true);
        assert.strictEqual(number.isBin("01010101"), false);
    });

    it("should check octal numbers as expected", () => {
        assert.strictEqual(number.isOct("01234567"), true);
        assert.strictEqual(number.isOct("0o1234567"), true);
        assert.strictEqual(number.isOct("0O1234567"), true);
        assert.strictEqual(number.isOct("012345678"), false);
        assert.strictEqual(number.isOct("01010101"), true);
    });

    it("should check decimal numbers as expected", () => {
        assert.strictEqual(number.isDec("1234567"), true);
        assert.strictEqual(number.isDec("01234567"), false);
        assert.strictEqual(number.isDec("012345678"), true);
        assert.strictEqual(number.isDec("012345678.123"), true);
        assert.strictEqual(number.isDec("1e12"), true);
        assert.strictEqual(number.isDec("1.1e12"), true);
        assert.strictEqual(number.isDec(".123"), true);
        assert.strictEqual(number.isDec(".1e23"), true);
    });

    it("should check hexadecimal numbers as expected", () => {
        assert.strictEqual(number.isHex("0x1f"), true);
        assert.strictEqual(number.isHex("0x1F "), true);
        assert.strictEqual(number.isHex("0X1F "), true);
        assert.strictEqual(number.isHex("0x1G"), false);
        assert.strictEqual(number.isHex("01F"), false);
    });

    it("should check BigInt numbers as expected", () => {
        if (typeof BigInt === "function") {
            assert.strictEqual(number.isBigInt("1234567n"), true);
            assert.strictEqual(number.isBigInt("1234567"), false);
        }
    });

    it("should check NaN and Infinity as expected", () => {
        assert.strictEqual(number.isNaN("NaN"), true);
        assert.strictEqual(number.isNaN("nan"), true);

        assert.strictEqual(number.isFinite("Infinity"), false);
        assert.strictEqual(number.isFinite("NaN"), false);
        assert.strictEqual(number.isFinite("nan"), false);
    });
});

describe("Parsing numbers from strings", () => {
    it("should parse binary numbers as expected", () => {
        assert.strictEqual(number.parse("0b1010101"), 0b1010101);
        assert.strictEqual(number.parse("0B1010101"), 0b1010101);
    });

    it("should parse octal numbers as expected", () => {
        assert.strictEqual(number.parse("01234567"), 01234567);
        assert.strictEqual(number.parse("0o1234567"), 01234567);
        assert.strictEqual(number.parse("0O1234567"), 01234567);
    });

    it("should parse decimal numbers as expected", () => {
        assert.strictEqual(number.parse("1234567"), 1234567);
        assert.strictEqual(number.parse("1234567.123"), 1234567.123);
        assert.strictEqual(number.parse("0123456789"), 123456789);
        assert.strictEqual(number.parse(".123"), 0.123);
        assert.strictEqual(number.parse("0.123"), 0.123);
        assert.strictEqual(number.parse("+0.123"), 0.123);
        assert.strictEqual(number.parse("-0.123"), -0.123);
    });

    it("should parse hexadecimal numbers as expected", () => {
        assert.strictEqual(number.parse("0x1234567"), 0x1234567);
        assert.strictEqual(number.parse("0x123abcdef"), 0x123abcdef);
        assert.strictEqual(number.parse("0X123ABC"), 0x123abc);
        assert.strictEqual(number.parse("0x123abc.123"), 0x123abc);
    });

    it("should parse BigInt numbers as expected", () => {
        if (typeof BigInt === "function") {
            assert.strictEqual(number.parse("1234567n"), BigInt(1234567));
            assert.strictEqual(number.parse("0b101010n"), BigInt("0b101010"));
            assert.strictEqual(number.parse("0o12343445n"), BigInt("0o12343445"));
            assert.strictEqual(number.parse("0x123abcn"), BigInt("0x123abc"));
            assert.strictEqual(number.parse("012343445n"), undefined);
        }
    });

    it("should parse NaN and Infinity as expected", () => {
        assert.ok(Number.isNaN(number.parse("NaN")));
        assert.strictEqual(typeof number.parse("NaN"), "number");
        assert.ok(Number.isNaN(number.parse("-NaN")));
        assert.strictEqual(typeof number.parse("-NaN"), "number");

        assert.strictEqual(number.parse("Infinity"), Infinity);
        assert.strictEqual(number.parse("-Infinity"), -Infinity);
    });

    it("should parse numbers with signed marks as expected", () => {
        assert.strictEqual(number.parse("+0b0101"), 0b0101);
        assert.strictEqual(number.parse("- 0b0101"), -0b0101);
        assert.strictEqual(number.parse("+01234567"), 01234567);
        assert.strictEqual(number.parse("-01234567"), -01234567);
        assert.strictEqual(number.parse("-0o1234567"), -0o1234567);
        assert.strictEqual(number.parse("+1234567"), 1234567);
        assert.strictEqual(number.parse("+1234567.123"), 1234567.123);
        assert.strictEqual(number.parse("+.123"), +.123);
        assert.strictEqual(number.parse("-1234567"), -1234567);
        assert.strictEqual(number.parse("-1234567.123"), -1234567.123);
        assert.strictEqual(number.parse("-.123"), -.123);
        assert.strictEqual(number.parse("+0x123abc"), 0x123abc);
        assert.strictEqual(number.parse("-0x123abc"), -0x123abc);

        if (typeof BigInt === "function") {
            assert.strictEqual(number.parse("+1234567n"), undefined);
            assert.strictEqual(number.parse("-1234567n"), BigInt(-1234567));
            assert.strictEqual(number.parse("-0b101010n"), -BigInt("0b101010"));
            assert.strictEqual(number.parse("-0o12343445n"), -BigInt("0o12343445"));
            assert.strictEqual(number.parse("-0x123abcn"), -BigInt("0x123abc"));
        }
    });

    it("should parse scientific notations as expected", () => {
        assert.strictEqual(number.parse("123e10"), 123e10);
        assert.strictEqual(number.parse("123E10"), 123E10);
        assert.strictEqual(number.parse("1e+10"), 1e+10);
        assert.strictEqual(number.parse("1e-10"), 1e-10);
        assert.strictEqual(number.parse("1.1e10"), 1.1e10);
        assert.strictEqual(number.parse(".1e23"), .1e23);
    });

    it("should parse numbers with leading spaces as expected", () => {
        assert.strictEqual(number.parse(" 01234567"), 01234567);
        assert.strictEqual(number.parse("  1234567"), 1234567);
        assert.strictEqual(number.parse("   1234567.123"), 1234567.123);
        assert.strictEqual(number.parse("    0x123abc"), 0x123abc);
    });

    it("should parse numbers with trailing characters as expected", () => {
        assert.strictEqual(number.parse("01234567abc"), 01234567);
        assert.strictEqual(number.parse("01234567.123"), 01234567);
        assert.strictEqual(number.parse("01234567 "), 01234567);
        assert.strictEqual(number.parse("1234567abc"), 1234567);
        assert.strictEqual(number.parse("1234567.123abc"), 1234567.123);
        assert.strictEqual(number.parse("1234567.123.123"), 1234567.123);
        assert.strictEqual(number.parse("0x123abc.123"), 0x123abc);
    });

    it("should parse numbers in strict mode as expected", () => {
        assert.strictEqual(number.parse("01234567", true), 01234567);
        assert.strictEqual(number.parse("1234567", true), 1234567);
        assert.strictEqual(number.parse(" 01234567", true), 01234567);
        assert.strictEqual(number.parse("  0123456789", true), 123456789);
        assert.strictEqual(number.parse("   0x123abc", true), 0x123abc);
        assert.strictEqual(number.parse("01234567 ", true), 01234567);
        assert.strictEqual(number.parse("1234567  ", true), 1234567);
        assert.strictEqual(number.parse("01234567  ", true), 01234567);
        assert.strictEqual(number.parse("0123456789  ", true), 123456789);
        assert.strictEqual(number.parse("0x123abc   ", true), 0x123abc);
    });

    it("should parse numbers with trailing boundaries in strict mode as expected", () => {
        assert.strictEqual(number.parse("01234567,123", true), 01234567);
        assert.strictEqual(number.parse("1234567;123", true), 1234567);
        assert.strictEqual(number.parse("1234567:123", true), 1234567);
        assert.strictEqual(number.parse("01234567)123", true), 01234567);
        assert.strictEqual(number.parse("01234567]123", true), 01234567);
        assert.strictEqual(number.parse("0123456789}123", true), 123456789);
    });
});

describe("Parsing tokens from number literals", () => {
    it("should parse the number literal as expected", () => {
        assert.deepStrictEqual(number.parseToken("012345"), {
            source: "012345",
            radix: 8,
            value: 012345,
            offset: 0,
            length: 6,
            type: "int"
        });
    });

    it("should parse the number literal with leading spaces as expected", () => {
        assert.deepStrictEqual(number.parseToken("    012345"), {
            source: "012345",
            radix: 8,
            value: 012345,
            offset: 4,
            length: 6,
            type: "int"
        });
    });


    it("should parse the number literal with trailing boundaries as expected", () => {
        assert.deepStrictEqual(number.parseToken("012345,"), {
            source: "012345",
            radix: 8,
            value: 012345,
            offset: 0,
            length: 6,
            type: "int"
        });
    });

    it("should parse the float literal as expected", () => {
        assert.deepStrictEqual(number.parseToken("8.9"), {
            source: "8.9",
            radix: 10,
            value: 8.9,
            offset: 0,
            length: 3,
            type: "float"
        });
    });

    it("should parse the bigint literal as expected", () => {
        if (typeof BigInt === "function") {
            assert.deepStrictEqual(number.parseToken("12345n"), {
                source: "12345n",
                radix: 10,
                value: BigInt("12345"),
                offset: 0,
                length: 6,
                type: "bigint"
            });
        }
    });

    it("should return null when the number literal is invalid", () => {
        assert.strictEqual(number.parseToken("012345abc"), null);
    });

    it("should parse the number literal with trailing dot as expected", () => {
        assert.deepStrictEqual(number.parseToken("12345."), {
            source: "12345.",
            radix: 10,
            value: 12345,
            offset: 0,
            length: 6,
            type: "int"
        });
    });
});

describe("Generating number literals from numbers", () => {
    it("should produce octal, decimal and hexadecimal numbers as expected", () => {
        assert.strictEqual(number.toLiteral(12345, 2), "0b11000000111001");
        assert.strictEqual(number.toLiteral(12345, number.BIN), "0b11000000111001");
        assert.strictEqual(number.toLiteral(-12345, 2), "-0b11000000111001");
        assert.strictEqual(number.toLiteral(-12345, number.BIN), "-0b11000000111001");
        assert.strictEqual(number.toLiteral(12345, 8), "0o30071");
        assert.strictEqual(number.toLiteral(12345, number.OCT), "0o30071");
        assert.strictEqual(number.toLiteral(-12345, 8), "-0o30071");
        assert.strictEqual(number.toLiteral(-12345, number.OCT), "-0o30071");
        assert.strictEqual(number.toLiteral(12345, 10), "12345");
        assert.strictEqual(number.toLiteral(12345, number.DEC), "12345");
        assert.strictEqual(number.toLiteral(-12345, 10), "-12345");
        assert.strictEqual(number.toLiteral(-12345, number.DEC), "-12345");
        assert.strictEqual(number.toLiteral(12345, 16), "0x3039");
        assert.strictEqual(number.toLiteral(12345, number.HEX), "0x3039");
        assert.strictEqual(number.toLiteral(-12345, 16), "-0x3039");
        assert.strictEqual(number.toLiteral(-12345, number.HEX), "-0x3039");
        assert.strictEqual(number.toLiteral(NaN), "NaN");
        assert.strictEqual(number.toLiteral(Infinity), "Infinity");
        assert.strictEqual(number.toLiteral(-NaN), "NaN");
        assert.strictEqual(number.toLiteral(-Infinity), "-Infinity");

        if (typeof BigInt === "function") {
            assert.strictEqual(number.toLiteral(BigInt(12345)), "12345n");
            assert.strictEqual(number.toLiteral(BigInt(-12345)), "-12345n");
            assert.strictEqual(number.toLiteral(BigInt(12345), 2), "0b11000000111001n");
            assert.strictEqual(number.toLiteral(BigInt(-12345), 2), "-0b11000000111001n");
            assert.strictEqual(number.toLiteral(BigInt(12345), 8), "0o30071n");
            assert.strictEqual(number.toLiteral(BigInt(-12345), 8), "-0o30071n");
            assert.strictEqual(number.toLiteral(BigInt(12345), 16), "0x3039n");
            assert.strictEqual(number.toLiteral(BigInt(-12345), 16), "-0x3039n");
        }
    });
});