import { CommandOptions, LegacyCommand } from '@teambit/legacy/dist/cli/legacy-command';
import type { Command, GenericObject } from '@teambit/legacy/dist/cli/command';
import { CLIMain } from './cli.main.runtime';

export class LegacyCommandAdapter implements Command {
  alias: string;
  name: string;
  description: string;
  options: CommandOptions;
  extendedDescription?: string;
  group?: string;
  loader?: boolean;
  commands: Command[];
  private?: boolean;
  skipWorkspace?: boolean;
  helpUrl?: string;
  loadAspects?: boolean;
  _packageManagerArgs?: string[];
  constructor(private cmd: LegacyCommand, cliExtension: CLIMain) {
    this.name = cmd.name;
    this.description = cmd.description;
    this.helpUrl = cmd.helpUrl;
    this.options = cmd.opts || [];
    this.alias = cmd.alias;
    this.extendedDescription = cmd.extendedDescription;
    this.skipWorkspace = cmd.skipWorkspace;
    this.group = cmd.group;
    this.loader = cmd.loader;
    this.private = cmd.private;
    this.loadAspects = false;
    this.commands = (cmd.commands || []).map((sub) => new LegacyCommandAdapter(sub, cliExtension));
  }

  private async action(params: any, options: { [key: string]: any }): Promise<ActionResult> {
    const res = await this.cmd.action(params, options, this._packageManagerArgs);
    let data = res;
    let code = 0;
    if (res && res.__code !== undefined) {
      data = res.data;
      code = res.__code;
    }
    const report = this.cmd.report(data, params, options);
    return {
      code,
      report,
    };
  }

  async report(params: any, options: { [key: string]: any }): Promise<{ data: string; code: number }> {
    const actionResult = await this.action(params, options);
    return { data: actionResult.report, code: actionResult.code };
  }

  async json(params: any, options: { [key: string]: any }): Promise<GenericObject> {
    const actionResult = await this.action(params, options);
    return {
      data: JSON.parse(actionResult.report),
      code: actionResult.code,
    };
  }
}

type ActionResult = {
  code: number;
  report: string;
};
