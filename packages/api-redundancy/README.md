# Redundancy

This package provides redundancy management for scripts that use API. It detects API connection timeouts and re-sends queries to backup API host(s).

It was designed to be used with Iconify icon components and plugins. It ensures that icon data is automatically retrieved from backup API in case main API server is unreachable, improving API uptime.

## Usage

Due to time constraints, documentation is not available.

See `lib/api/` in `core` package in sibling directory of this repository for usage.

## License

This package is licensed under MIT license.

`SPDX-License-Identifier: MIT`

Previous versions of this package were dual-licensed under Apache 2.0 and GPL 2.0 licence, which was messy and confusing. This was later changed to MIT for simplicity.

© 2021-PRESENT Vjacheslav Trushkin
