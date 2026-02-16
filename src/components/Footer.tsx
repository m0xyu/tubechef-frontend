import { Link } from '@tanstack/react-router';
import { FaGithub, FaUtensils } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="text-xl font-bold text-slate-900 flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg text-sm">
                <FaUtensils />
              </span>
              AI Recipe Generator
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              YouTubeの料理動画を、読みやすいレシピカードに変換。<br/>
              毎日の料理をもっと楽しく、スムーズに。
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://github.com/m0xyu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-slate-900 transition-colors p-2">
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-sm">機能</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors">トップページ</Link>
              </li>
              <li>
                <Link to="/recipes" search={{ page: 1 }} className="hover:text-orange-500 transition-colors">みんなのレシピ</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-orange-500 transition-colors">閲覧履歴</Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-orange-500 transition-colors">マイライブラリ</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-sm">サポート</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors">利用規約</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors">プライバシーポリシー</Link>
              </li>
              {/* <li>
                <a href="#" className="hover:text-orange-500 transition-colors">お問い合わせ</a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} AI Recipe Generator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};